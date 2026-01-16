"use server";

import axios from "axios";
import { authOrganizationActionClient } from "../safe-action";
import { getNotion } from "./get-notion";
import { getNotionDatabaseSchema } from "~/schemas/notion/get-notion-database-schema";
import { exportNotionSchema } from "~/schemas/notion/export-notion-schema";
import { getUserStories } from "~/data/user-stories/get-user-stories";
import { UserStory } from "~/components/organizations/slug/projects/epics/advanced-tools/user-stories/user-story-data-table";
import { notionExportUpdate } from "../user-stories/notion-export-update";

function createNotionChildrenFromProps(
  props: { [s: string]: unknown } | ArrayLike<unknown>,
) {
  const children = [];

  for (const [key, value] of Object.entries(props)) {
    const titleCaseKey = key
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase());

    // Add heading_2 for the section
    children.push({
      object: "block",
      type: "heading_2",
      heading_2: {
        rich_text: [{ type: "text", text: { content: titleCaseKey } }],
      },
    });

    // Handle acceptance criteria
    if (key.toLowerCase().includes("criteria")) {
      const criteria: any = value;
      const lines = criteria.split("\n");
      let currentScenarioTitle: string | null = null;
      let currentScenarioContent: string[] = [];

      const pushScenario = () => {
        if (!currentScenarioTitle) return;

        // heading_3 for scenario title
        children.push({
          object: "block",
          type: "heading_3",
          heading_3: {
            rich_text: [
              { type: "text", text: { content: currentScenarioTitle } },
            ],
          },
        });

        // paragraph(s) for each line
        currentScenarioContent.forEach((line) => {
          if (line.trim()) {
            children.push({
              object: "block",
              type: "paragraph",
              paragraph: {
                rich_text: [
                  {
                    type: "text",
                    text: { content: line.trim().replace(/^[-*]\s*/, "") },
                  },
                ],
              },
            });
          }
        });

        currentScenarioTitle = null;
        currentScenarioContent = [];
      };

      for (let line of lines) {
        line = line.trim();
        if (line.startsWith("####")) {
          pushScenario();
          currentScenarioTitle = line.replace(/^####\s*/, "");
        } else if (line) {
          currentScenarioContent.push(line);
        }
      }
      pushScenario();

      // Handle checklist
    } else if (key.toLowerCase() === "checklist" && Array.isArray(value)) {
      for (const item of value) {
        children.push({
          object: "block",
          type: "to_do",
          to_do: {
            rich_text: [{ type: "text", text: { content: String(item.name) } }],
            checked: false,
          },
        });
      }

      // Handle generic paragraph content
    } else {
      children.push({
        object: "block",
        type: "paragraph",
        paragraph: {
          rich_text: [{ type: "text", text: { content: String(value) } }],
        },
      });
    }
  }

  return children;
}

async function createNotionDatabasePages(
  auth_token: string,
  notionDB: {
    notionDBId: string;
    pageProjectId: string | null;
  },
  userStory: UserStory,
  notionProjectId: string,
) {
  const notionVersion = process.env.NEXT_NOTION_VERSION;
  const headers = {
    "Content-Type": "application/json",
    "Notion-Version": notionVersion,
    Authorization: `Bearer ${auth_token}`,
  };

  try {
    const childrenData = createNotionChildrenFromProps({
      Description: userStory.description,
      "Acceptance Criteria": userStory.acceptanceCriteria,
      checklist: userStory.checkListItems,
    });

    const parentPagePayload = {
      parent: { database_id: notionDB.notionDBId },
      properties: {
        ["title"]: {
          title: [{ text: { content: userStory.name } }],
        },
        [`${notionDB.pageProjectId}`]: {
          relation: [{ id: notionProjectId }],
        },
      },
      children: childrenData,
    };

    await axios.post(`https://api.notion.com/v1/pages`, parentPagePayload, {
      headers,
    });

    return userStory.id;
  } catch (error: any) {
    if (error?.response) {
      console.error(
        "❌ Notion API error:",
        error.response.status,
        error.response.data,
      );
    } else {
      console.error("❌ Unexpected error:", error.message);
    }
    return "";
  }
}

export const exportToNotionDatabase = authOrganizationActionClient
  .metadata({ actionName: "exportToNotionDatabase" })
  .schema(exportNotionSchema)
  .action(async ({ parsedInput }) => {
    const { projectId, epicId, notionProjectId } = parsedInput;
    const data = await getUserStories({
      epicId,
      pageIndex: 0,
      pageSize: 100,
    });
    const userStories = data.userStories.filter((v) => !v.notionExport);
    if (userStories.length === 0) {
      return { data: "All datas Exported" };
    }
    const notion = await getNotion({ projectId });
    const notionAuthToken = notion?.data && notion?.data[0].auth_token;
    const notionDB =
      notion?.data &&
      notion.data[0].notionProjectDB.find((v) => {
        if (
          v.taskDB == true &&
          projectId === v.projectId &&
          epicId === v.epicId
        ) {
          return {
            notionDBId: v.notionDBId,
            pageProjectId: v.pageProjectId,
          };
        }
      });
    if (notionAuthToken && notionDB && userStories.length > 0) {
      const resData = await Promise.all(
        userStories.map((userStory) =>
          createNotionDatabasePages(
            notionAuthToken,
            notionDB,
            userStory as UserStory,
            notionProjectId,
          ),
        ),
      );
      await notionExportUpdate({ projectId, epicId, userStoryIds: resData });
      return resData ? resData : { serverError: "Notion auth token error" };
    }
  });
