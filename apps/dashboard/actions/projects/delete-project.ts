'use server';

import { revalidateTag } from 'next/cache';

import { NotFoundError } from '@workspace/common/errors';
import { prisma } from '@workspace/database/client';

import { Caching, OrganizationCacheKey } from '~/data/caching';
import { deleteProjectSchema } from '~/schemas/projects/delete-project-schema';
import { authOrganizationActionClient } from '../safe-action';

export const deleteProject = authOrganizationActionClient
  .metadata({ actionName: 'deleteProject' })
  .schema(deleteProjectSchema)
  .action(async ({ parsedInput, ctx }) => {
    const count = await prisma.project.count({
      where: { organizationId: ctx.organization.id, id: parsedInput.projectId }
    });
    if (count < 1) throw new NotFoundError('Project not found');

    await prisma.project.delete({
      where: { organizationId: ctx.organization.id, id: parsedInput.projectId }
    });

    revalidateTag(
      Caching.createOrganizationTag(
        OrganizationCacheKey.Projects,
        ctx.organization.id
      )
    );

    revalidateTag(
      Caching.createOrganizationTag(
        OrganizationCacheKey.Project,
        ctx.organization.id,
        parsedInput.projectId
      )
    );
  });
