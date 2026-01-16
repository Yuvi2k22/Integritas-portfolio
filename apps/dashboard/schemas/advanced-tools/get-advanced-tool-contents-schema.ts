import { z } from 'zod';

export const getAdvancedToolContentsSchema = z.object({
  epicId: z
    .string({
      required_error: 'epicId is required',
      invalid_type_error: 'epicId must be a string'
    })
    .trim()
    .uuid(),
  toolId: z
    .string({
      required_error: 'toolId is required',
      invalid_type_error: 'toolId must be a string'
    })
    .trim()
    .uuid()
});

export type GetAdvancedToolContentsSchema = z.infer<
  typeof getAdvancedToolContentsSchema
>;
