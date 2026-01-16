'use server';

import { revalidateTag } from 'next/cache';

import { Epic } from '@workspace/database';
import { prisma } from '@workspace/database/client';

import { Caching, OrganizationCacheKey } from '~/data/caching';
import { upsertEpicSchema } from '~/schemas/epics/upsert-epic-schema';
import { authOrganizationActionClient } from '../safe-action';

export const upsertEpic = authOrganizationActionClient
  .metadata({ actionName: 'upsertEpic' })
  .schema(upsertEpicSchema)
  .action(async ({ parsedInput, ctx }) => {
    let epic: Epic;

    if (!parsedInput.idToUpdate) {
      epic = await prisma.epic.create({
        data: {
          projectId: parsedInput.projectId,
          name: parsedInput.name,
          description: parsedInput.description,
          epicSpeciality: parsedInput.epicSpeciality,
          thirdpartyRequirements: parsedInput.thirdpartyRequirements
        }
      });
    } else {
      epic = await prisma.epic.update({
        where: { projectId: parsedInput.projectId, id: parsedInput.idToUpdate },
        data: {
          name: parsedInput.name,
          description: parsedInput.description,
          epicSpeciality: parsedInput.epicSpeciality,
          thirdpartyRequirements: parsedInput.thirdpartyRequirements
        }
      });
    }

    revalidateTag(
      Caching.createOrganizationTag(
        OrganizationCacheKey.Epics,
        ctx.organization.id,
        parsedInput.projectId
      )
    );

    return epic;
  });
