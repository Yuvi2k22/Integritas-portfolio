export enum TemplateFields {
  OrganizationId = '[organizationId]',
  ProjectId = '[projectId]',
  EpicId = '[epicId]',
  FileId = '[fileId]',
}

export const S3_Key_Templates = {
  epicDesignFile:
    'Organizations/Organization-[organizationId]/Project-[projectId]/Epic-[epicId]/designFiles/[fileId]',
  epicAudioFile:
    'Organizations/Organization-[organizationId]/Project-[projectId]/Epic-[epicId]/audioFiles/[fileId]',
};

export function getKeyFromTemplate(
  templateKey: string,
  replaceDict: { [Key in TemplateFields]?: string },
) {
  let completedKey = templateKey;

  Object.entries(replaceDict).forEach(([key, val]) => {
    completedKey = completedKey.replaceAll(key, val);
  });

  return completedKey;
}
