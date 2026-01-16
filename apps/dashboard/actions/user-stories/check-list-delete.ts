'use server';

import { z } from 'zod';

import { prisma } from '@workspace/database/client';

import { authOrganizationActionClient } from '../safe-action';

// 1. Define a simple schema that only takes an `id`
const deleteChecklistItemSchema = z.object({
  id: z.string()
});

// 2. Create the action
export const deleteChecklistItem = authOrganizationActionClient
  .metadata({ actionName: 'deleteChecklistItem' })
  .schema(deleteChecklistItemSchema)
  .action(async ({ parsedInput }) => {
    const { id } = parsedInput;
    return prisma.userStoryCheckListItem.delete({
      where: { id }
    });
  });
