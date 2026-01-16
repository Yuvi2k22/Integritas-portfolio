import { literal, z } from 'zod';

import { SortDirection } from '~/types/sort-direction';

export enum GetProjectsSortBy {
  Name = 'name',
  CreatedAt = 'createdAt',
  UpdatedAt = 'updatedAt'
}

export const getProjectsSchema = z.object({
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
  sortBy: z.nativeEnum(GetProjectsSortBy, {
    required_error: 'Sort by is required.',
    invalid_type_error: 'Sort by must be a string.'
  }),
  sortDirection: z.nativeEnum(SortDirection, {
    required_error: 'Sort direction is required.',
    invalid_type_error: 'Sort direction must be a string.'
  }),
  searchQuery: z
    .string({
      invalid_type_error: 'Search query must be a string.'
    })
    .max(2000, 'Maximum 2000 characters allowed.')
    .optional()
    .or(literal(''))
});

export type GetProjectsSchema = z.infer<typeof getProjectsSchema>;
