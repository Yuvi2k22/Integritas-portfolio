import 'server-only';

import { ValidationError } from '@workspace/common/errors';
import { prisma } from '@workspace/database/client';

import { getEpicSchema, GetEpicSchema } from '~/schemas/epics/get-epic-schema';
import { DesignFileDto } from '~/types/dtos/design-file-dto';
import { EpicDto } from '~/types/dtos/epic-dto';

export async function getEpic(input: GetEpicSchema): Promise<EpicDto | null> {
  const result = getEpicSchema.safeParse(input);
  if (!result.success) {
    throw new ValidationError(JSON.stringify(result.error.flatten()));
  }
  const parsedInput = result.data;

  const epic = await prisma.epic.findFirst({
    where: {
      id: parsedInput.epicId,
      projectId: parsedInput.projectId,
    },
    include: {
      designFiles: {
        where: { parentFileId: null },
        orderBy: { orderIndex: 'asc' },
        include: {
          subFiles: {
            orderBy: { orderIndex: 'asc' },
          },
        },
      },
      epicFeedbacks: {
        select: {
          id: true,
          type: true,
          advancedToolId: true,
          satisfied: true,
          reason: true,
        },
      },
    },
  });

  if (!epic) return null;
  const designFiles: DesignFileDto[] = epic.designFiles.map((designFile) => {
    const {
      id,
      filename,
      description,
      designFlowDoc,
      orderIndex,
      epicId,
      subFiles,
      s3ObjectKey,
    } = designFile;

    const formattedSubFiles: DesignFileDto[] = subFiles.map((subFile) => {
      const {
        id,
        filename,
        description,
        designFlowDoc,
        orderIndex,
        epicId,
        s3ObjectKey,
        parentFileId,
      } = subFile;
      return {
        id,
        filename,
        description,
        designFlowDoc,
        orderIndex,
        epicId,
        accessUrl: `${process.env.NEXT_PUBLIC_AWS_CLOUDFRONT_DISTRIBUTION_DOMAIN}/${s3ObjectKey}`,
        parentFileId,
      };
    });

    return {
      id,
      filename,
      description,
      designFlowDoc,
      orderIndex,
      epicId,
      accessUrl: `${process.env.NEXT_PUBLIC_AWS_CLOUDFRONT_DISTRIBUTION_DOMAIN}/${s3ObjectKey}`,
      subFiles: formattedSubFiles,
    };
  });
  return {
    ...epic,
    designFiles,
    createdAt: epic.createdAt.toISOString(),
    updatedAt: epic.updatedAt.toISOString(),
  };
}
