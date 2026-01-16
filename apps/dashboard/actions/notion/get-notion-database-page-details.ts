"use server";

import axios from "axios";
import { authOrganizationActionClient } from "../safe-action";
import { getNotion } from "./get-notion";
import { getNotionDatabaseSchema } from "~/schemas/notion/get-notion-database-schema";

function getTitleContent(properties: any) {
  for (const key in properties) {
    const value = properties[key];
    if (
      value &&
      value.id === "title" &&
      value.type === "title" &&
      Array.isArray(value.title)
    ) {
      for (const item of value.title) {
        if ("plain_text" in item) {
          return item.plain_text;
        }
      }
    }
  }
  return null; // Return null if no matching title is found
}
async function getNotionDatabasePages(auth_token: string, id: string) {
  const notionVersion = process.env.NEXT_NOTION_VERSION;
  try {
    const response = await axios.post(
      `https://api.notion.com/v1/databases/${id}/query`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          "Notion-Version": notionVersion,
          Authorization: `Bearer ${auth_token}`,
        },
      },
    );
    if (response) {
      const finalData = [];

      for (let i = 0; i < response.data.results.length; i++) {
        const data = response.data.results[i];
        const name = getTitleContent(data?.properties);
        if (!name) {
          finalData.length = 0;
          break;
        }
        finalData.push({
          id: data.id,
          name,
        });
      }
      return finalData;
    }
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

export const getNotionPageDetails = authOrganizationActionClient
  .metadata({ actionName: "getNotionDatabaseDetails" })
  .schema(getNotionDatabaseSchema)
  .action(async ({ parsedInput }) => {
    const { projectId, epicId } = parsedInput;
    const notion = await getNotion({ projectId });
    const notionAuthToken = notion?.data && notion?.data[0].auth_token;
    const notionDB =
      notion?.data &&
      notion.data[0].notionProjectDB.find(
        (v) =>
          v.epicDB == true && projectId === v.projectId && epicId === v.epicId,
      );
    if (notionAuthToken && notionDB) {
      const notionDatabse = await getNotionDatabasePages(
        notionAuthToken,
        notionDB?.notionDBId as string,
      );
      return notionDatabse;
    }
  });
