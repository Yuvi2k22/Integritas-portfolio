'use server';

import { NotFoundError } from '@workspace/common/errors';

import { validateProjectAndEpic } from '~/lib/utils/api/validations';
import { updateAdvancedToolContentSchema } from '~/schemas/advanced-tools/update-advanced-tool-content-schema';
import { authOrganizationActionClient } from '../safe-action';
import { prisma } from '@workspace/database/client';

export const updateAdvancedToolContent = authOrganizationActionClient
  .metadata({ actionName: 'updateAdvancedToolContent' })
  .schema(updateAdvancedToolContentSchema)
  .action(async ({ ctx, parsedInput }) => {
    const [{ epic }, toolCount] = await Promise.all([
      validateProjectAndEpic(parsedInput.projectId, parsedInput.epicId),
      prisma.advancedTool.count({ where: { id: parsedInput.toolId } }),
    ]);
    if (toolCount === 0) throw new NotFoundError('Tool not found');

    const existingContent = await prisma.advancedToolGeneratedContent.findFirst(
      { where: { toolId: parsedInput.toolId, epicId: epic.id } },
    );

    if (!existingContent)
      throw new NotFoundError('content not exist to update');

    return await prisma.advancedToolGeneratedContent.update({
      where: {
        toolId: parsedInput.toolId,
        epicId: epic.id,
        id: existingContent.id,
      },
      data: { content: parsedInput.content },
    });
  });
