"use server";

import axios from "axios";
import { authOrganizationActionClient } from "../safe-action";
import { getNotionSchema } from "~/schemas/notion/get-notion-schema";
import { getNotion } from "./get-notion";
async function getNotionDatabaseDetails(auth_token: string) {
  const notionVersion = process.env.NEXT_NOTION_VERSION;
  await new Promise((res) => setTimeout(res, 10000));
  try {
    const response = await axios.post(
      "https://api.notion.com/v1/search",
      {
        filter: {
          property: "object",
          value: "database",
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Notion-Version": notionVersion,
          Authorization: `Bearer ${auth_token}`,
        },
      },
    );
    if (response) {
      const finalData = response.data.results.map((data: any) => ({
        id: data.id,
        name: data.title[0].plain_text,
        properties: data.properties,
      }));
      return finalData;
    }
    return response;
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

export const getNotionDatabase = authOrganizationActionClient
  .metadata({ actionName: "getNotionDatabase" })
  .schema(getNotionSchema)
  .action(async ({ parsedInput }) => {
    const { projectId } = parsedInput;

    const notion = await getNotion({ projectId });
    const notionAuthToken = notion?.data && notion?.data[0].auth_token;
    if (notionAuthToken) {
      let notionDatabase = [];
      const maxRetries = 3;
      for (let i = 0; i < maxRetries; i++) {
        notionDatabase = await getNotionDatabaseDetails(notionAuthToken);
        if (notionDatabase && notionDatabase.length > 0) {
          return notionDatabase;
        }
        if (!notionDatabase) {
          return { serverError: "Notion api error" };
        }
        i++;
      }
      return { serverError: "Notion api error" };
    } else {
      return { serverError: "server error" };
    }
  });
