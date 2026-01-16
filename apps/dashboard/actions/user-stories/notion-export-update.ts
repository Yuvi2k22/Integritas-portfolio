"use server";

import { prisma } from "@workspace/database/client";

import { validateProjectAndEpic } from "~/lib/utils/api/validations";
import { authOrganizationActionClient } from "../safe-action";
import { notionExportUpdateUserStorySchema } from "~/schemas/user-stories/notion-export-user-story-schema";

export const notionExportUpdate = authOrganizationActionClient
  .metadata({ actionName: "notionExportUpdate" })
  .schema(notionExportUpdateUserStorySchema) // Accept an array of user story updates
  .action(async ({ parsedInput }) => {
    const { projectId, epicId, userStoryIds } = parsedInput;
    const { epic } = await validateProjectAndEpic(projectId, epicId);
    const transactions = userStoryIds.map((input) =>
      prisma.userStory.update({
        where: {
          id: input,
          epicId: epic.id,
        },
        data: {
          notionExport: input ? true : false,
        },
      }),
    );

    await prisma.$transaction(transactions);
  });
