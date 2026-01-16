import 'server-only';

import { unstable_cache as cache } from 'next/cache';

import { getAuthOrganizationContext } from '@workspace/auth/context';
import { ValidationError } from '@workspace/common/errors';
import { prisma } from '@workspace/database/client';

import {
  getProjectSchema,
  GetProjectSchema
} from '~/schemas/projects/get-project-schema';
import { ProjectDto } from '~/types/dtos/project-dto';
import {
  Caching,
  defaultRevalidateTimeInSeconds,
  OrganizationCacheKey
} from '../caching';

export async function getProject(
  input: GetProjectSchema
): Promise<ProjectDto | null> {
  const ctx = await getAuthOrganizationContext();

  const result = getProjectSchema.safeParse(input);
  if (!result.success) {
    throw new ValidationError(JSON.stringify(result.error.flatten()));
  }
  const parsedInput = result.data;

  return cache(
    async () => {
      const project = await prisma.project.findFirst({
        where: {
          organizationId: ctx.organization.id,
          id: parsedInput.projectId
        }
      });

      if (!project) return null;

      return {
        ...project,
        createdAt: project.createdAt.toISOString(),
        updatedAt: project.updatedAt.toISOString()
      };
    },
    Caching.createOrganizationKeyParts(
      OrganizationCacheKey.Project,
      ctx.organization.id,
      parsedInput.projectId
    ),
    {
      revalidate: defaultRevalidateTimeInSeconds,
      tags: [
        Caching.createOrganizationTag(
          OrganizationCacheKey.Project,
          ctx.organization.id,
          parsedInput.projectId
        )
      ]
    }
  )();
}
