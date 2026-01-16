import { literal, z } from 'zod';

import { SortDirection } from '~/types/sort-direction';

export enum GetUserStoriesSortBy {
  Name = 'name',
  Status = 'completed',
  DueDate = 'dueDate',
  StoryPoints = 'storyPoints'
}

export const getUserStoriesSchema = z.object({
  projectId: z
    .string({
      required_error: 'projectId is required.',
      invalid_type_error: 'projectId must be a string.'
    })
    .trim()
    .uuid('projectId is invalid')
    .min(1, 'projectId is required.')
    .max(36, 'Maximum 36 characters allowed.')
    .optional(),
  epicId: z
    .string({
      required_error: 'epicId is required.',
      invalid_type_error: 'epicId must be a string.'
    })
    .trim()
    .uuid('epicId is invalid.')
    .min(1, 'epicId is required.')
    .max(36, 'Maximum 36 characters allowed.'),
  pageIndex: z.coerce
    .number({
      required_error: 'Page index is required.',
      invalid_type_error: 'Page index must be a number.'
    })
    .int()
    .min(0, 'Page number must be equal or greater than 1.')
    .max(
      Number.MAX_SAFE_INTEGER,
      `Page number must be equal or smaller than ${Number.MAX_SAFE_INTEGER}.`
    ),
  pageSize: z.coerce
    .number({
      required_error: 'Page size is required.',
      invalid_type_error: 'Page size must be a number.'
    })
    .int()
    .min(1, 'Page size must be equal or greater than 1.')
    .max(100, 'Page number must be equal or smaller than 100.'),
  sortBy: z
    .nativeEnum(GetUserStoriesSortBy, {
      required_error: 'Sort by is required.',
      invalid_type_error: 'Sort by must be a string.'
    })
    .optional(),
  sortDirection: z
    .nativeEnum(SortDirection, {
      required_error: 'Sort direction is required.',
      invalid_type_error: 'Sort direction must be a string.'
    })
    .optional(),
  searchQuery: z
    .string({
      invalid_type_error: 'Search query must be a string.'
    })
    .max(2000, 'Maximum 2000 characters allowed.')
    .optional()
    .or(literal(''))
});

export type GetUserStoriesSchema = z.infer<typeof getUserStoriesSchema>;
