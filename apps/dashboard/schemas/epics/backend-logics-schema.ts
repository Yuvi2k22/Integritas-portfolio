import { z } from 'zod';

// Optional audio file schema
const fileSchema = z
  .instanceof(File, {
    message: 'Audio must be a valid file if provided.',
  })
  .optional();

// Optional text schema
const textSchema = z
  .string({
    invalid_type_error: 'Text must be a string.',
  })
  .trim()
  .min(10, 'Text must be minimum of 10 characters.')
  .optional();

// Define the schema
export const baseBackendLogicsSchema = z.object({
  audio: fileSchema,
  totalAudio: fileSchema,
  text: textSchema,
  projectId: z
    .string({
      required_error: 'projectId is required.',
      invalid_type_error: 'projectId must be a string.',
    })
    .trim()
    .uuid('projectId is invalid.')
    .min(1, 'projectId is required.')
    .max(36, 'Maximum 36 characters allowed.'),
  epicId: z
    .string({
      required_error: 'epicId is required.',
      invalid_type_error: 'epicId must be a string.',
    })
    .trim()
    .uuid('epicId is invalid.')
    .min(1, 'epicId is required.')
    .max(36, 'Maximum 36 characters allowed.'),
  audioRecordedTime: z
    .string({
      invalid_type_error: 'Audio recorded time must be a string.',
    })
    .trim()
    .optional(),
  langCode: z
    .string({
      invalid_type_error: 'Language code must be a string.',
    })
    .trim()
    .optional(),
});

export type BackendLogicsSchema = z.infer<typeof baseBackendLogicsSchema>;
