'use server';

import { prisma } from '@workspace/database/client';

import { validateProjectAndEpic } from '~/lib/utils/api/validations';
import { addUserStorySchema } from '~/schemas/user-stories/add-user-story-schema';
import { authOrganizationActionClient } from '../safe-action';

export const addUserStory = authOrganizationActionClient
  .metadata({ actionName: 'addUserStory' })
  .schema(addUserStorySchema)
  .action(async ({ parsedInput }) => {
    const { epic } = await validateProjectAndEpic(
      parsedInput.projectId,
      parsedInput.epicId
    );
    try {
      const newStory = await prisma.$transaction(async (tx) => {
        const { _max } = await tx.userStory.aggregate({
          where: { epicId: epic.id },
          _max: { orderIndex: true }
        });
        const nextIndex = (_max.orderIndex ?? 0) + 1;
        return tx.userStory.create({
          data: {
            epicId: epic.id,
            name: parsedInput.name,
            description: parsedInput.description,
            orderIndex: nextIndex
          }
        });
      });

      return newStory;
    } catch (error) {
      return { serverError: error };
    }
  });
