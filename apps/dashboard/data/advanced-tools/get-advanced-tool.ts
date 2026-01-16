import 'server-only';

import { ValidationError } from '@workspace/common/errors';
import { prisma } from '@workspace/database/client';

import {
  getAdvancedToolSchema,
  GetAdvancedToolSchema
} from '~/schemas/advanced-tools/get-advanced-tool-schema';
import { AdvancedToolDto } from '~/types/dtos/advanced-tool-dto';

export async function getAdvancedTool(
  input: GetAdvancedToolSchema
): Promise<AdvancedToolDto | null> {
  const result = getAdvancedToolSchema.safeParse(input);
  if (!result.success) {
    throw new ValidationError(JSON.stringify(result.error.flatten()));
  }
  const parsedInput = result.data;

  const tool = await prisma.advancedTool.findFirst({
    where: { slug: parsedInput.slug },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      orderIndex: true,
      categoryId: true
    }
  });

  return tool;
}
