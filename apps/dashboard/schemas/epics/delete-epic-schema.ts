import { z } from 'zod';

export const deleteEpicSchema = z.object({
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
    .max(36, 'Maximum 36 characters allowed.')
});

export type DeleteEpicSchema = z.infer<typeof deleteEpicSchema>;
