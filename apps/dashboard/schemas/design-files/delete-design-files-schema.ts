import { z } from 'zod';

export const deleteDesignFilesSchema = z.object({
  projectId: z
    .string({
      required_error: 'projectId is required',
      invalid_type_error: 'projectId must be a string'
    })
    .trim()
    .uuid('projectId is invalid'),
  epicId: z
    .string({
      required_error: 'epicId is required',
      invalid_type_error: 'epicId must be a string'
    })
    .trim()
    .uuid('epicId is invalid'),
  fileIdsForDeletion: z.array(
    z
      .string({
        required_error: 'id of design file is required',
        invalid_type_error: 'id of design file must be a string'
      })
      .trim()
      .uuid()
  )
});
