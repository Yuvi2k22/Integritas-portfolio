'use server';

import { prisma } from '@workspace/database/client';

import { validateProjectAndEpic } from '~/lib/utils/api/validations';
import { updateDesignFilesSchema } from '~/schemas/design-files/update-design-files-schema';
import { authOrganizationActionClient } from '../safe-action';

export const updateDesignFiles = authOrganizationActionClient
  .metadata({ actionName: 'updateDesignFiles' })
  .schema(updateDesignFilesSchema)
  .action(async ({ parsedInput }) => {
    const { epic } = await validateProjectAndEpic(
      parsedInput.projectId,
      parsedInput.epicId
    );

    let orderIndex = 0;

    for (const file of parsedInput.updatedFiles) {
      // update main file
      await prisma.designFile.update({
        where: { epicId: epic.id, id: file.id },
        data: {
          filename: file.filename,
          description: file.description,
          orderIndex: orderIndex++,
          parentFileId: null
        }
      });

      // update subfiles
      for (const subFile of file.subFiles) {
        await prisma.designFile.update({
          where: { epicId: epic.id, id: subFile.id },
          data: {
            filename: subFile.filename,
            description: subFile.description,
            orderIndex: orderIndex++,
            parentFileId: file.id
          }
        });
      }
    }
  });
