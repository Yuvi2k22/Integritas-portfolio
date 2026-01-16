'use server';

import { NotFoundError } from '@workspace/common/errors';
import { prisma } from '@workspace/database/client';

import { updateEpicFlowSchema } from '~/schemas/epics/update-epic-flow-schema';
import { authOrganizationActionClient } from '../safe-action';

export const updateEpicFlow = authOrganizationActionClient
  .metadata({ actionName: 'updateEpicFlow' })
  .schema(updateEpicFlowSchema)
  .action(async ({ parsedInput, ctx }) => {
    const [projectCount, epicCount] = await prisma.$transaction([
      prisma.project.count({
        where: {
          organizationId: ctx.organization.id,
          id: parsedInput.projectId
        }
      }),
      prisma.epic.count({
        where: { projectId: parsedInput.projectId, id: parsedInput.epicId }
      })
    ]);

    if (projectCount === 0 || epicCount === 0)
      throw new NotFoundError('Resource missing');

    const updatedEpic = await prisma.epic.update({
      where: { id: parsedInput.epicId },
      data: { epicFlowDoc: parsedInput.epicFlowDoc }
    });

    return updatedEpic;
  });
