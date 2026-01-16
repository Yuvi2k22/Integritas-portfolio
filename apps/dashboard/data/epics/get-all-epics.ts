import 'server-only';
import { ValidationError } from '@workspace/common/errors';
import { Prisma } from '@workspace/database';
import { prisma } from '@workspace/database/client';
import { EpicDto } from '~/types/dtos/epic-dto';
import {
  getAllEpicsSchema,
  GetAllEpicsSchema,
} from '~/schemas/epics/get-all-epics-schema';

export async function getAllEpics(
  input: GetAllEpicsSchema,
): Promise<EpicDto[]> {
  const result = getAllEpicsSchema.safeParse(input);
  if (!result.success) {
    throw new ValidationError(JSON.stringify(result.error.flatten()));
  }
  const parsedInput = result.data;

  const nameSearchVector: Prisma.StringFilter | undefined =
    parsedInput.searchQuery
      ? { contains: parsedInput.searchQuery, mode: 'insensitive' }
      : undefined;

  const [epics] = await prisma.$transaction([
    prisma.epic.findMany({
      where: { projectId: parsedInput.projectId, name: nameSearchVector },
      orderBy: { createdAt: 'desc' },
    }),
  ]);
  const mappedEpics: EpicDto[] = epics.map((epic) => ({
    ...epic,
    createdAt: epic.createdAt.toISOString(),
    updatedAt: epic.updatedAt.toISOString(),
  }));

  return mappedEpics as EpicDto[];
}
