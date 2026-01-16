'use server';

import { prisma } from '@workspace/database/client';

import { validateProjectAndEpic } from '~/lib/utils/api/validations';
import { updateUserStorySchema } from '~/schemas/user-stories/update-user-story-schema';
import { authOrganizationActionClient } from '../safe-action';

export const updateUserStory = authOrganizationActionClient
  .metadata({ actionName: 'updateUserStory' })
  .schema(updateUserStorySchema)
  .action(async ({ parsedInput }) => {
    const { epic } = await validateProjectAndEpic(
      parsedInput.projectId,
      parsedInput.epicId
    );

    await prisma.userStory.update({
      where: { id: parsedInput.userStoryId, epicId: epic.id },
      data: {
        name: parsedInput.name,
        description: parsedInput.description,
        storyPoints: parsedInput.storyPoints,
        completed: parsedInput.completed,
        acceptanceCriteria: parsedInput.acceptanceCriteria,
        orderIndex: parsedInput.orderIndex,
        dueDate: parsedInput.dueDate
          ? new Date(parsedInput.dueDate)
          : undefined,
        assignees: {
          set: parsedInput.assignees
        }
      }
    });
  });
