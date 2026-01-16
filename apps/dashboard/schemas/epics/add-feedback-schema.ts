import { optional, z } from 'zod';

import { EpicFeedbackType } from '@workspace/database';

export const addFeedbackSchema = z.object({
  epicId: z
    .string({
      required_error: 'epicId is required for adding feedback.',
      invalid_type_error: 'epicId must be a string.'
    })
    .trim()
    .uuid('epicId is invalid to update.'),
  feedbackType: z.nativeEnum(EpicFeedbackType, {
    required_error: 'feedbackType is required',
    invalid_type_error: 'feedbackType must be a string'
  }),
  advancedToolId: z
    .string({
      invalid_type_error: 'advancedToolId must be a string.'
    })
    .trim()
    .uuid('advancedToolId is invalid to update.')
    .optional(),
  satisfied: z.boolean({
    required_error: 'satisfied is required for adding feedback.',
    invalid_type_error: 'satisfied must be a boolean value'
  }),
  reason: z.string().optional()
});

export type AddFeedbackSchema = z.infer<typeof addFeedbackSchema>;
