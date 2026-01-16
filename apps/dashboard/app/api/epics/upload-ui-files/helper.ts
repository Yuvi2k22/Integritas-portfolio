import {
  getKeyFromTemplate,
  S3_Key_Templates,
  TemplateFields,
  uploadFiles
} from '@workspace/aws/s3';
import { EpicStatus, Prisma } from '@workspace/database';
import { prisma } from '@workspace/database/client';

/**
 * Upload the files with unique key to S3,
 * adds the entries in database,
 * returns the S3 put command outputs and added entries in db
 *
 * @param organizationId id of the organization that contains the respective project
 * @param projectId id of the project to which the epic and designfiles belong
 * @param epicId id of the epic to which the designfiles belong
 * @param files array of files uploaded by user
 */
export async function uploadDesignFilesAndUpdateDB(
  organizationId: string,
  projectId: string,
  epicId: string,
  files: File[]
) {
  const entriesForDB: Prisma.DesignFileCreateManyInput[] = []; // array that will be passed to createMany db action
  const filesWithKeys: { file: File; key: string }[] = []; // formatted data for uploading to S3
  const regex = /[^a-zA-Z0-9\s]/g;
  files.forEach((file, index) => {
    // format data for operations
    const targetKeyTemplate = S3_Key_Templates.epicDesignFile;
    const fileDetails = file.name.split('.');
    const extension = fileDetails.slice(-1).join('').trim();
    const filename = fileDetails
      .slice(0, -1)
      .join('')
      .trim()
      .replace(regex, '');

    const fileId = `${filename}-${new Date().toISOString()}.${extension}`;
    const key = getKeyFromTemplate(targetKeyTemplate, {
      [TemplateFields.OrganizationId]: organizationId,
      [TemplateFields.ProjectId]: projectId,
      [TemplateFields.EpicId]: epicId,
      [TemplateFields.FileId]: fileId
    });

    filesWithKeys.push({ key, file }); // add structured data for upload
    entriesForDB.push({
      // add structured data for db insert
      epicId,
      filename: file.name,
      s3ObjectKey: key,
      orderIndex: index + 1
    });
  });

  return Promise.all([
    uploadFiles(filesWithKeys),
    prisma.designFile.createManyAndReturn({ data: entriesForDB }),
    prisma.epic.update({
      where: { projectId, id: epicId },
      data: { status: EpicStatus.UPLOAD_COMPLETED }
    })
  ]);
}
