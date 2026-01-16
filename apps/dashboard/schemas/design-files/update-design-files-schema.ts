import { z } from 'zod';

const fileDataSchema = z.object({
  id: z
    .string({
      required_error: 'id is required for file',
      invalid_type_error: 'id should be string'
    })
    .trim()
    .uuid(),
  filename: z
    .string({
      required_error: 'filename is required',
      invalid_type_error: 'filename should be string'
    })
    .trim()
    .min(5),
  description: z
    .string({
      required_error: 'description is required',
      invalid_type_error: 'description should be string'
    })
    .trim()
    .min(5)
});

export const updateDesignFilesSchema = z.object({
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
  updatedFiles: z.array(
    fileDataSchema.merge(
      z.object({
        subFiles: z.array(fileDataSchema).default([])
      })
    )
  )
});

export type UpdateDesignFilesSchema = z.infer<typeof updateDesignFilesSchema>;
