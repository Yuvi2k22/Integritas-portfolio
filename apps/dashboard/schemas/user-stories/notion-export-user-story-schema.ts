import { z } from "zod";

export const notionExportUpdateUserStorySchema = z.object({
  projectId: z
    .string({
      required_error: "projectId is required.",
      invalid_type_error: "projectId must be a string.",
    })
    .trim()
    .uuid("projectId is invalid.")
    .max(36, "Maximum 36 characters allowed."),
  epicId: z
    .string({
      required_error: "epicId is required.",
      invalid_type_error: "epicId must be a string.",
    })
    .trim()
    .uuid("epicId is invalid.")
    .max(36, "Maximum 36 characters allowed."),
  userStoryIds: z
    .array(
      z
        .string()
        .trim()
        .uuid("Each userStoryId must be a valid UUID.")
        .max(36, "Maximum 36 characters allowed."),
    )
    .min(1, "At least one userStoryId is required."),
});
export type NotionExportUpdateUserStorySchema = z.infer<
  typeof notionExportUpdateUserStorySchema
>;
