import { z } from 'zod';

export const addUserStorySchema = z.object({
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
  name: z
    .string({
      required_error: 'Name is required.',
      invalid_type_error: 'Name must be a string.'
    })
    .trim()
    .min(1, 'Name is required')
    .max(4000, 'Name cannot exceed 4000 chars'),
  description: z
    .string({
      required_error: 'Description is required.',
      invalid_type_error: 'Description must be a string.'
    })
    .trim()
    .min(1, 'Description is required')
    .optional()
});

export type AddUserStorySchema = z.infer<typeof addUserStorySchema>;
