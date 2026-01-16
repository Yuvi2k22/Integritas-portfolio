import { z } from 'zod';

export const getUserStorySchema = z.object({
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
    .max(36, 'Maximum 36 characters allowed.')
});

export type GetUserStorySchema = z.infer<typeof getUserStorySchema>;
