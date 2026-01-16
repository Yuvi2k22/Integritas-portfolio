import { z } from 'zod';

export const upsertEpicSchema = z.object({
  projectId: z
    .string({
      required_error: 'projectId is required for update.',
      invalid_type_error: 'projectId must be a string.'
    })
    .trim()
    .uuid('projectId is invalid to update.')
    .min(1, 'projectId is required for update.')
    .max(36, 'Maximum 36 characters allowed.'),
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
  epicSpeciality: z
    .string({
      required_error: 'reason for feature is required.',
      invalid_type_error: 'reason for feature must be a string.'
    })
    .trim()
    .optional(),
  thirdpartyRequirements: z
    .string({
      required_error: 'Thirdparty Requirements is required.',
      invalid_type_error: 'Thirdparty Requirements must be a string.'
    })
    .trim()
    .optional(),
  idToUpdate: z
    .string({
      required_error: 'epicId (ie. idToUpdate) is required for update.',
      invalid_type_error: 'epicId (ie. idToUpdate) must be a string.'
    })
    .trim()
    .uuid('epicId (ie. idToUpdate) is invalid to update.')
    .min(1, 'epicId (ie. idToUpdate) is required for update.')
    .max(36, 'Maximum 36 characters allowed.')
    .optional()
});

export type UpsertEpicSchema = z.infer<typeof upsertEpicSchema>;
