'use server';

import { prisma } from '@workspace/database/client';

import { validateProjectAndEpic } from '~/lib/utils/api/validations';
import { deleteDesignFilesSchema } from '~/schemas/design-files/delete-design-files-schema';
import { authOrganizationActionClient } from '../safe-action';

export const deleteDesignFiles = authOrganizationActionClient
  .metadata({ actionName: 'deleteDesignFiles' })
  .schema(deleteDesignFilesSchema)
  .action(async ({ parsedInput }) => {
    const { epic } = await validateProjectAndEpic(
      parsedInput.projectId,
      parsedInput.epicId
    );

    await prisma.designFile.deleteMany({
      where: { epicId: epic.id, id: { in: parsedInput.fileIdsForDeletion } }
    });
  });
