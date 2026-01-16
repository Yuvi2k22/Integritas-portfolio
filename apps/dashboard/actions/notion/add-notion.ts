"use server";

import axios from "axios";

import { prisma } from "@workspace/database/client";
import { addNotionSchema } from "~/schemas/notion/add-notion-schema";
import { authOrganizationActionClient } from "../safe-action";
import { getNotion } from "./get-notion";
async function getNotionAccessToken(code: string, redirect_uri: string) {
  const clientId = process.env.NEXT_PUBLIC_NOTION_CLIENT_ID;
  const clientSecret = process.env.NEXT_PUBLIC_NOTION_CLIENT_SECRET;
  const notionVersion = process.env.NEXT_NOTION_VERSION;
  const base64Token = Buffer.from(`${clientId}:${clientSecret}`).toString(
    "base64",
  );
  try {
    const response = await axios.post(
      "https://api.notion.com/v1/oauth/token",
      {
        grant_type: "authorization_code",
        code,
        redirect_uri: decodeURIComponent(redirect_uri),
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Notion-Version": notionVersion,
          Authorization: `Basic ${base64Token}`,
        },
      },
    );

    const accessToken = response.data.access_token;
    return accessToken;
  } catch (error: any) {
    if (error?.response) {
      console.error(
        "❌ Notion token error:",
        error.response.status,
        error.response.data,
      );
    } else {
      console.error("❌ Unknown error:", error.message);
    }
    return false;
  }
}

export const addNotion = authOrganizationActionClient
  .metadata({ actionName: "addNotion" })
  .schema(addNotionSchema)
  .action(async ({ parsedInput }) => {
    const { projectId, epicId, code, redirect_uri } = parsedInput;
    const auth_token = await getNotionAccessToken(code, redirect_uri);
    if (auth_token) {
      try {
        const notionAuthExist = await getNotion({ projectId });
        return notionAuthExist?.data && notionAuthExist?.data?.length > 0
          ? await prisma.notionIntegration.update({
              where: { id: notionAuthExist.data[0].id },
              data: {
                auth_token: auth_token,
              },
            })
          : await prisma.notionIntegration.create({
              data: {
                projectId,
                auth_token,
              },
            });
      } catch (error) {
        console.error("Error creating integration:", error);
        return { serverError: "Notion integration db error" };
      }
    } else {
      return { serverError: "Notion auth token error" };
    }
  });
