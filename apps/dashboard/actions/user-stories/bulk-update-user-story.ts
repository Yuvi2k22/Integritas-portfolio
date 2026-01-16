'use server';

import { prisma } from '@workspace/database/client';

import { validateProjectAndEpic } from '~/lib/utils/api/validations';
import { updateUserStorySchema } from '~/schemas/user-stories/update-user-story-schema';
import { authOrganizationActionClient } from '../safe-action';

export const updateUserStoriesBulk = authOrganizationActionClient
  .metadata({ actionName: 'updateUserStoriesBulk' })
  .schema(updateUserStorySchema.array()) // Accept an array of user story updates
  .action(async ({ parsedInput }) => {
    if (parsedInput.length === 0) return;
    const firstInput = parsedInput[0];
    const { epic } = await validateProjectAndEpic(
      firstInput.projectId,
      firstInput.epicId
    );

    const allSameEpic = parsedInput.every(
      (input) =>
        input.projectId === firstInput.projectId &&
        input.epicId === firstInput.epicId
    );

    if (!allSameEpic) {
      throw new Error('All user stories must belong to the same feature');
    }

    const transactions = parsedInput.map((input) =>
      prisma.userStory.update({
        where: {
          id: input.userStoryId,
          epicId: epic.id
        },
        data: {
          orderIndex: input.orderIndex
        }
      })
    );

    await prisma.$transaction(transactions);
  });
