'use server';

import { prisma } from '@workspace/database/client';

import { validateProjectAndEpic } from '~/lib/utils/api/validations';
import { deleteUserStorySchema } from '~/schemas/user-stories/delete-user-story-schema';
import { authOrganizationActionClient } from '../safe-action';

export const deleteUserStory = authOrganizationActionClient
  .metadata({ actionName: 'deleteUserStory' })
  .schema(deleteUserStorySchema)
  .action(async ({ parsedInput }) => {
    const { epic } = await validateProjectAndEpic(
      parsedInput.projectId,
      parsedInput.epicId
    );

    await prisma.userStory.delete({
      where: {
        id: parsedInput.userStoryId,
        epicId: epic.id
      }
    });
  });
