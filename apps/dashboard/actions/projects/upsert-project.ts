'use server';

import { revalidateTag } from 'next/cache';

import { Project } from '@workspace/database';
import { prisma } from '@workspace/database/client';

import { Caching, OrganizationCacheKey } from '~/data/caching';
import { upsertProjectSchema } from '~/schemas/projects/upsert-project-schema';
import { authOrganizationActionClient } from '../safe-action';

export const upsertProject = authOrganizationActionClient
  .metadata({ actionName: 'createProject' })
  .schema(upsertProjectSchema)
  .action(async ({ parsedInput, ctx }) => {
    let project: Project;

    if (!parsedInput.idToUpdate) {
      project = await prisma.project.create({
        data: {
          organizationId: ctx.organization.id,
          name: parsedInput.name,
          description: parsedInput.description
        }
      });
    } else {
      project = await prisma.project.update({
        where: {
          id: parsedInput.idToUpdate,
          organizationId: ctx.organization.id
        },
        data: { name: parsedInput.name, description: parsedInput.description }
      });
    }

    revalidateTag(
      Caching.createOrganizationTag(
        OrganizationCacheKey.Projects,
        ctx.organization.id
      )
    );

    if (parsedInput.idToUpdate) {
      revalidateTag(
        Caching.createOrganizationTag(
          OrganizationCacheKey.Project,
          ctx.organization.id,
          parsedInput.idToUpdate
        )
      );
    }

    return project;
  });
