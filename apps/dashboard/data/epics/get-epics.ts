import 'server-only';

import { unstable_cache as cache } from 'next/cache';

import { getAuthOrganizationContext } from '@workspace/auth/context';
import { ValidationError } from '@workspace/common/errors';
import { Prisma } from '@workspace/database';
import { prisma } from '@workspace/database/client';

import {
  getEpicsSchema,
  GetEpicsSchema
} from '~/schemas/epics/get-epics-schema';
import { EpicDto } from '~/types/dtos/epic-dto';
import {
  Caching,
  defaultRevalidateTimeInSeconds,
  OrganizationCacheKey
} from '../caching';

export async function getEpics(
  input: GetEpicsSchema
): Promise<{ epics: EpicDto[]; filteredCount: number }> {
  const ctx = await getAuthOrganizationContext();

  const result = getEpicsSchema.safeParse(input);
  if (!result.success) {
    throw new ValidationError(JSON.stringify(result.error.flatten()));
  }
  const parsedInput = result.data;

  const nameSearchVector: Prisma.StringFilter | undefined =
    parsedInput.searchQuery
      ? { contains: parsedInput.searchQuery, mode: 'insensitive' }
      : undefined;

  return cache(
    async () => {
      const [epics, filteredCount] = await prisma.$transaction([
        prisma.epic.findMany({
          skip: parsedInput.pageIndex * parsedInput.pageSize,
          take: parsedInput.pageSize,
          where: { projectId: parsedInput.projectId, name: nameSearchVector },
          orderBy: { [parsedInput.sortBy]: parsedInput.sortDirection }
        }),
        prisma.epic.count({
          where: { projectId: parsedInput.projectId, name: nameSearchVector }
        })
      ]);

      const mappedEpics: EpicDto[] = epics.map((epic) => ({
        ...epic,
        createdAt: epic.createdAt.toISOString(),
        updatedAt: epic.updatedAt.toISOString()
      }));

      return { epics: mappedEpics, filteredCount };
    },
    Caching.createOrganizationKeyParts(
      OrganizationCacheKey.Epics,
      ctx.organization.id,
      parsedInput.projectId
    ),
    {
      revalidate: defaultRevalidateTimeInSeconds,
      tags: [
        Caching.createOrganizationTag(
          OrganizationCacheKey.Epics,
          ctx.organization.id,
          parsedInput.projectId
        )
      ]
    }
  )();
}
