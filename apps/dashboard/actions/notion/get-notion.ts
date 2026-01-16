"use server";
import { prisma } from "@workspace/database/client";
import { authOrganizationActionClient } from "../safe-action";
import { getNotionSchema } from "~/schemas/notion/get-notion-schema";

export const getNotion = authOrganizationActionClient
  .metadata({ actionName: "getNotion" })
  .schema(getNotionSchema)
  .action(async ({ parsedInput }) => {
    const { projectId } = parsedInput;
    const data = await prisma.notionIntegration.findMany({
      where: {
        projectId: projectId,
      },
      include: { notionProjectDB: true },
    });
    return data;
  });
