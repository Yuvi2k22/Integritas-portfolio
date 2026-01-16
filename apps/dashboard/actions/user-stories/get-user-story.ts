"use server";
import { prisma } from "@workspace/database/client";
import { generateUserStoriesSchema } from "~/schemas/user-stories/generate-user-stories-schema";
import { authOrganizationActionClient } from "../safe-action";

export const getUserStories = authOrganizationActionClient
  .metadata({
    actionName: "getUserStories",
  })
  .schema(generateUserStoriesSchema)
  .action(async ({ parsedInput }) => {
    const { projectId, epicId } = parsedInput;
  });
