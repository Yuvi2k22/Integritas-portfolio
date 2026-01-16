import { z } from 'zod';
import { zfd } from 'zod-form-data';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes per file
const MAX_FILES = 20; // Maximum number of files

export const uploadEpicFilesSchema = zfd.formData({
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
  files: zfd
    .repeatableOfType(
      zfd.file().refine((file) => file.size <= MAX_FILE_SIZE, {
        message: `File size must be less than 10 MB`
      })
    )
    .refine((files) => files.length <= MAX_FILES, {
      message: `You can upload up to ${MAX_FILES} files only.`
    })
});

export type UploadEpicFilesSchema = z.infer<typeof uploadEpicFilesSchema>;
