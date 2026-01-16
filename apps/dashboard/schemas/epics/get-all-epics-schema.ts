import { literal, z } from 'zod';

export enum GetEpicsSortBy {
  Name = 'name',
  CreatedAt = 'createdAt',
  UpdatedAt = 'updatedAt',
}

export const getAllEpicsSchema = z.object({
  projectId: z
    .string({
      required_error: 'projectId is required for update.',
      invalid_type_error: 'projectId must be a string.',
    })
    .trim()
    .uuid('projectId is invalid to update.')
    .min(1, 'projectId is required for update.')
    .max(36, 'Maximum 36 characters allowed.'),
  searchQuery: z
    .string({
      invalid_type_error: 'Search query must be a string.',
    })
    .max(2000, 'Maximum 2000 characters allowed.')
    .optional()
    .or(literal('')),
});

export type GetAllEpicsSchema = z.infer<typeof getAllEpicsSchema>;
