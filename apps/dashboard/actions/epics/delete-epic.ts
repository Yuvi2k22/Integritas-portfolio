'use server';

import { revalidateTag } from 'next/cache';

import { NotFoundError } from '@workspace/common/errors';
import { prisma } from '@workspace/database/client';

import { Caching, OrganizationCacheKey } from '~/data/caching';
import { deleteEpicSchema } from '~/schemas/epics/delete-epic-schema';
import { authOrganizationActionClient } from '../safe-action';

export const deleteEpic = authOrganizationActionClient
  .metadata({ actionName: 'deleteEpic' })
  .schema(deleteEpicSchema)
  .action(async ({ parsedInput, ctx }) => {
    const count = await prisma.epic.count({
      where: { id: parsedInput.epicId, projectId: parsedInput.projectId }
    });
    if (count < 1) throw new NotFoundError('Epic not found');

    await prisma.epic.delete({
      where: { id: parsedInput.epicId, projectId: parsedInput.projectId }
    });

    revalidateTag(
      Caching.createOrganizationTag(
        OrganizationCacheKey.Epics,
        ctx.organization.id,
        parsedInput.projectId
      )
    );
  });
