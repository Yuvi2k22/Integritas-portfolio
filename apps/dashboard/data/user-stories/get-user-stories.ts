import "server-only";

import { unstable_cache as cache } from "next/cache";

import { getAuthOrganizationContext } from "@workspace/auth/context";
import { ValidationError } from "@workspace/common/errors";
import { Prisma } from "@workspace/database";
import { prisma } from "@workspace/database/client";

import {
  GetUserStoriesSchema,
  getUserStoriesSchema,
} from "~/schemas/user-stories/get-user-stories-schema";
import { UserStoryDto } from "~/types/dtos/user-story-dto";

export async function getUserStories(input: GetUserStoriesSchema): Promise<{
  notionExportEnable: any;
  acceptanceCriteriaGenerate: number;
  userStories: UserStoryDto[];
  filteredCount: number;
}> {
  const ctx = await getAuthOrganizationContext();

  const result = getUserStoriesSchema.safeParse(input);
  if (!result.success) {
    throw new ValidationError(JSON.stringify(result.error.flatten()));
  }

  const parsedInput = result.data;

  const nameSearchVector: Prisma.StringFilter | undefined =
    parsedInput.searchQuery
      ? { contains: parsedInput.searchQuery, mode: "insensitive" }
      : undefined;

  return (async () => {
    const [
      userStories,
      filteredCount,
      acceptanceCriteriaGenerate,
      notionExportEnable,
    ] = await prisma.$transaction([
      prisma.userStory.findMany({
        skip: parsedInput.pageIndex * parsedInput.pageSize,
        take: parsedInput.pageSize,
        where: { epicId: parsedInput.epicId, name: nameSearchVector },
        include: {
          assignees: {
            include: {
              user: true,
            },
          },
          checkListItems: {
            orderBy: { orderIndex: "asc" },
          },
        },
        orderBy: { orderIndex: "asc" },
      }),
      prisma.userStory.count({
        where: { epicId: parsedInput.epicId, name: nameSearchVector },
      }),
      prisma.userStory.count({
        where: { epicId: parsedInput.epicId, acceptanceCriteria: "" },
      }),
      prisma.userStory.count({
        where: {
          epicId: parsedInput.epicId,
          OR: [{ notionExport: false }, { notionExport: null }],
        },
      }),
    ]);

    const mappedUserStories: UserStoryDto[] = userStories.map((userStory) => {
      const checkListItems = userStory.checkListItems.map((item) => {
        return {
          id: item.id,
          name: item.name,
          orderIndex: item.orderIndex,
          completed: item.completed,
          createdAt: item.createdAt.toISOString(),
          updatedAt: item.updatedAt.toISOString(),
          userStoryId: item.userStoryId,
        };
      });
      const assignees = userStory.assignees.map((member) => ({
        membershipId: member.id,
        id: member.user.id,
        image: member.user.image ?? undefined,
        name: member.user.name,
        email: member.user.email!,
        role: member.role,
        isOwner: member.isOwner,
        dateAdded: member.user.createdAt,
        lastLogin: member.user.lastLogin ?? undefined,
      }));
      return {
        id: userStory.id,
        name: userStory.name,
        description: userStory.description,
        storyPoints: userStory.storyPoints,
        completed: userStory.completed,
        orderIndex: userStory.orderIndex,
        acceptanceCriteria: userStory.acceptanceCriteria,
        dueDate: userStory.dueDate ? userStory.dueDate?.toISOString() : "",
        createdAt: userStory.createdAt.toISOString(),
        updatedAt: userStory.updatedAt.toISOString(),
        assignees,
        checkListItems: checkListItems,
        notionExport: userStory.notionExport ? userStory.notionExport : false,
      };
    });
    return {
      userStories: mappedUserStories,
      filteredCount,
      acceptanceCriteriaGenerate,
      notionExportEnable,
    };
  })();
}
