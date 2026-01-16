import { PrismaClient } from '@prisma/client';
import { createSoftDeleteExtension } from 'prisma-extension-soft-delete';

/**
 * Creates a customized prisma client with options to soft delete
 * @returns prisma client
 */
function createPrismaClient() {
  return new PrismaClient().$extends(
    createSoftDeleteExtension({
      models: {
        Project: true,
        Epic: true,
        DesignFile: true,
        UserStory: true,
        UserStoryCheckListItem: true,
        AdvancedToolCategory: true,
        AdvancedTool: true,
        AdvancedToolGeneratedContent: true
      },
      defaultConfig: {
        field: 'deletedAt',
        createValue: (deleted) => {
          if (deleted) return new Date();
          return null;
        }
      }
    })
  );
}

declare global {
  // eslint-disable-next-line no-var
  var prisma: ReturnType<typeof createPrismaClient>;
}

export const prisma: ReturnType<typeof createPrismaClient> =
  global.prisma || createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}
