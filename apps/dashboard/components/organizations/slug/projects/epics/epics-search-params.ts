import {
  createSearchParamsCache,
  createSerializer,
  parseAsInteger,
  parseAsString,
  parseAsStringLiteral
} from 'nuqs/server';

import { GetEpicsSortBy } from '~/schemas/epics/get-epics-schema';
import { SortDirection } from '~/types/sort-direction';

export const searchParams = {
  pageIndex: parseAsInteger.withDefault(0),
  pageSize: parseAsInteger.withDefault(20),
  sortBy: parseAsStringLiteral(Object.values(GetEpicsSortBy)).withDefault(
    GetEpicsSortBy.CreatedAt
  ),
  sortDirection: parseAsStringLiteral(Object.values(SortDirection)).withDefault(
    SortDirection.Desc
  ),
  searchQuery: parseAsString.withDefault('')
};

export const searchParamsCache = createSearchParamsCache(searchParams);
export const serializer = createSerializer(searchParams);
