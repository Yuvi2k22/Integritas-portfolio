import 'server-only';

import { prisma } from '@workspace/database/client';

import { AdvancedToolCategoryDto } from '~/types/dtos/advanced-tool-category-dto';

export async function getAdvancedToolCategories(): Promise<
  AdvancedToolCategoryDto[]
> {
  const categories = await prisma.advancedToolCategory.findMany({
    orderBy: { orderIndex: 'asc' },
    include: {
      tools: {
        select: {
          id: true,
          name: true,
          slug: true,
          description: true,
          orderIndex: true,
          categoryId: true
        },
        orderBy: { orderIndex: 'asc' }
      }
    }
  });

  return categories;
}
