import 'server-only';

import { ValidationError } from '@workspace/common/errors';
import { prisma } from '@workspace/database/client';

import {
  getAdvancedToolContentsSchema,
  GetAdvancedToolContentsSchema,
} from '~/schemas/advanced-tools/get-advanced-tool-contents-schema';
import { AdvancedToolGeneratedContentDto } from '~/types/dtos/advanced-tool-generated-content-dto';

export async function getAdvancedToolContents(
  input: GetAdvancedToolContentsSchema,
): Promise<AdvancedToolGeneratedContentDto[]> {
  const result = getAdvancedToolContentsSchema.safeParse(input);
  if (!result.success) {
    throw new ValidationError(JSON.stringify(result.error.flatten()));
  }
  const parsedInput = result.data;

  const contents = await prisma.advancedToolGeneratedContent.findMany({
    where: { epicId: parsedInput.epicId, toolId: parsedInput.toolId },
    select: {
      id: true,
      content: true,
      epicId: true,
      toolId: true,
      reGenerateCount: true,
    },
  });
  return contents;
}
