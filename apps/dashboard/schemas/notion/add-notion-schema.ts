import { z } from 'zod';

export const addNotionSchema = z.object({
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
  code: z
    .string({
      required_error: 'code is required.',
      invalid_type_error: 'code must be a string.'
    })
    .trim()
    .min(1, 'code is required.'),
  redirect_uri: z
    .string({
      required_error: 'redirect_url is required.',
      invalid_type_error: 'redirect_url must be a string.'
    })
    .trim()
    .min(1, 'redirect_url is required.')
});

export type AddNotionSchema = z.infer<typeof addNotionSchema>;
