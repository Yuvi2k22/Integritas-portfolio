'use server';

import { prisma } from '@workspace/database/client';

import { updateChecklistItemSchema } from '~/schemas/user-stories/check-list-item-schema';
import { authOrganizationActionClient } from '../safe-action';

export const updateChecklistItem = authOrganizationActionClient
  .metadata({ actionName: 'upsertChecklistItem' })
  .schema(updateChecklistItemSchema)
  .action(async ({ parsedInput }) => {
    const { userStoryId, checkList } = parsedInput;

    if (checkList.id) {
      return prisma.userStoryCheckListItem.update({
        where: { id: checkList.id },
        data: {
          name: checkList.name,
          orderIndex: checkList.orderIndex,
          completed: checkList.completed
        }
      });
    } else {
      return prisma.userStoryCheckListItem.create({
        data: {
          userStoryId,
          name: checkList.name,
          orderIndex: checkList.orderIndex,
          completed: checkList.completed
        }
      });
    }
  });
