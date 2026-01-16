import 'server-only';

import { unstable_cache as cache } from 'next/cache';

import { getAuthOrganizationContext } from '@workspace/auth/context';
import { ValidationError } from '@workspace/common/errors';
import { Prisma } from '@workspace/database';
import { prisma } from '@workspace/database/client';

import {
  getProjectsSchema,
  GetProjectsSchema
} from '~/schemas/projects/get-projects-schema';
import { ProjectDto } from '~/types/dtos/project-dto';
import {
  Caching,
  defaultRevalidateTimeInSeconds,
  OrganizationCacheKey
} from '../caching';

export async function getProjects(input: GetProjectsSchema): Promise<{
  projects: ProjectDto[];
  filteredCount: number;
}> {
  const ctx = await getAuthOrganizationContext();

  const result = getProjectsSchema.safeParse(input);
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
      const [projects, filteredCount] = await prisma.$transaction([
        prisma.project.findMany({
          skip: parsedInput.pageIndex * parsedInput.pageSize,
          take: parsedInput.pageSize,
          where: {
            organizationId: ctx.organization.id,
            name: nameSearchVector
          },
          orderBy: { [parsedInput.sortBy]: parsedInput.sortDirection }
        }),
        prisma.project.count({
          where: { organizationId: ctx.organization.id, name: nameSearchVector }
        })
      ]);

      const mappedProjects: ProjectDto[] = projects.map((project) => ({
        ...project,
        createdAt: project.createdAt.toISOString(),
        updatedAt: project.updatedAt.toISOString()
      }));

      return { projects: mappedProjects, filteredCount };
    },
    Caching.createOrganizationKeyParts(
      OrganizationCacheKey.Projects,
      ctx.organization.id,
      parsedInput.pageIndex.toString(),
      parsedInput.pageSize.toString(),
      parsedInput.sortBy,
      parsedInput.sortDirection,
      parsedInput.searchQuery?.toString() ?? ''
    ),
    {
      revalidate: defaultRevalidateTimeInSeconds,
      tags: [
        Caching.createOrganizationTag(
          OrganizationCacheKey.Projects,
          ctx.organization.id
        )
      ]
    }
  )();
}
