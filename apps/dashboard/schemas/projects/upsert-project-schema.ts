import { z } from 'zod';

export const upsertProjectSchema = z.object({
  name: z
    .string({
      required_error: 'Name is required.',
      invalid_type_error: 'Name must be a string.'
    })
    .trim()
    .min(1, 'Name is required.')
    .max(4000, 'Maximum 4000 characters allowed.'),
  description: z
    .string({
      required_error: 'Description is required.',
      invalid_type_error: 'Description must be a string.'
    })
    .trim()
    .min(1, 'Description is required')
    .optional(),
  idToUpdate: z
    .string({
      required_error: 'projectId (ie. idToUpdate) is required for update.',
      invalid_type_error: 'projectId (ie. idToUpdate) must be a string.'
    })
    .trim()
    .uuid('projectId (ie. idToUpdate) is invalid to update.')
    .min(1, 'projectId (ie. idToUpdate) is required for update.')
    .max(36, 'Maximum 36 characters allowed.')
    .optional()
});

export type UpsertProjectSchema = z.infer<typeof upsertProjectSchema>;
