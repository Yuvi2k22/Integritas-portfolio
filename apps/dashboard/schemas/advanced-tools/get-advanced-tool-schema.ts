import { z } from 'zod';

export const getAdvancedToolSchema = z.object({
  slug: z
    .string({
      required_error: 'slug is required',
      invalid_type_error: 'slug must be a string'
    })
    .trim()
});

export type GetAdvancedToolSchema = z.infer<typeof getAdvancedToolSchema>;
