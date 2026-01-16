import { z } from 'zod';

export const updateChecklistItemSchema = z.object({
  userStoryId: z.string(),
  checkList: z.object({
    id: z.string().optional(),
    name: z.string(),
    orderIndex: z.number().optional(),
    completed: z.boolean().optional()
  })
});
