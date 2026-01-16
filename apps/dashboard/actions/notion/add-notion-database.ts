"use server";

import { prisma } from "@workspace/database/client";
import { authOrganizationActionClient } from "../safe-action";
import { getNotion } from "./get-notion";
import { addNotionProjectDBSchema } from "~/schemas/notion/add-notion-project-db-schema";

export const addNotionProjectDatabase = authOrganizationActionClient
  .metadata({ actionName: "addNotionProjectDatabase" })
  .schema(addNotionProjectDBSchema)
  .action(async ({ parsedInput }) => {
    const { projectId, epicId, notionDb } = parsedInput;
    const notion = await getNotion({ projectId });
    const notionIntegrationId = notion?.data?.[0]?.id as string;
    const notionProjectExistData = notion?.data?.[0]?.notionProjectDB;
    if (notionProjectExistData && notionProjectExistData.length > 0) {
      await prisma.notionProjectDB.deleteMany({
        where: {
          projectId,
          epicId,
          notionIntegrationId,
        },
      });
    }
    return await Promise.all(
      notionDb.map((v) =>
        prisma.notionProjectDB.create({
          data: {
            projectId,
            epicId,
            notionIntegrationId,
            ...v,
          },
        }),
      ),
    );
  });
