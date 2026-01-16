import { z } from 'zod';

export const updateUserStorySchema = z.object({
  projectId: z
    .string({
      required_error: 'projectId is required.',
      invalid_type_error: 'projectId must be a string.'
    })
    .trim()
    .uuid('projectId is invalid.')
    .min(1, 'projectId is required.')
    .max(36, 'Maximum 36 characters allowed.'),
  epicId: z
    .string({
      required_error: 'epicId is required.',
      invalid_type_error: 'epicId must be a string.'
    })
    .trim()
    .uuid('epicId is invalid.')
    .min(1, 'epicId is required.')
    .max(36, 'Maximum 36 characters allowed.'),
  userStoryId: z
    .string({
      required_error: 'userStoryId is required.',
      invalid_type_error: 'userStoryId must be a string.'
    })
    .trim()
    .uuid('userStoryId is invalid.')
    .min(1, 'userStoryId is required.')
    .max(36, 'Maximum 36 characters allowed.'),
  name: z
    .string({
      required_error: 'Name is required.',
      invalid_type_error: 'Name must be a string.'
    })
    .trim()
    .min(1, 'Name is required')
    .max(4000, 'Name cannot exceed 4000 chars')
    .optional(),
  description: z
    .string({
      required_error: 'Description is required.',
      invalid_type_error: 'Description must be a string.'
    })
    .trim()
    .min(1, 'Description is required')
    .optional(),
  acceptanceCriteria: z
    .string({
      required_error: 'acceptanceCriteria is required.',
      invalid_type_error: 'acceptanceCriteria must be a string.'
    })
    .trim()
    .optional(),
  orderIndex: z
    .number({
      required_error: 'orderIndex is required if provided',
      invalid_type_error: 'orderIndex must be a integer if provider'
    })
    .min(0)
    .optional(),
  storyPoints: z
    .number({
      required_error: 'storyPoints is required if provided',
      invalid_type_error: 'storyPoints must be a integer if provider'
    })
    .min(0)
    .optional(),
  completed: z
    .boolean({
      required_error: 'completed is required if provided',
      invalid_type_error: 'completed must be boolean if provided'
    })
    .optional(),
  dueDate: z
    .union([z.string(), z.date()])
    .optional()
    .transform((d) =>
      d == null ? undefined : d instanceof Date ? d.toISOString() : d
    ),
  assignees: z
    .array(
      z.object({
        id: z
          .string({
            required_error: 'assignee id is required.',
            invalid_type_error: 'assignee id must be a string.'
          })
          .trim()
          .uuid('assignee id is invalid.')
          .min(1, 'assignee id is required.')
      })
    )
    .optional()
});

export type UpdateUserStorySchema = z.infer<typeof updateUserStorySchema>;
