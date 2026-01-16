import { z } from 'zod';

export const generateAdvancedToolContentSchema = z.object({
  projectId: z
    .string({
      required_error: 'projectId is required.',
      invalid_type_error: 'projectId must be a string.'
    })
    .trim()
    .uuid('projectId is invalid.'),
  epicId: z
    .string({
      required_error: 'epicId is required.',
      invalid_type_error: 'epicId must be a string.'
    })
    .trim()
    .uuid('epicId is invalid.'),
  toolId: z
    .string({
      required_error: 'toolId is required',
      invalid_type_error: 'toolId must be a string'
    })
    .trim()
    .uuid()
});

export type GenerateAdvancedToolContentSchema = z.infer<
  typeof generateAdvancedToolContentSchema
>;
