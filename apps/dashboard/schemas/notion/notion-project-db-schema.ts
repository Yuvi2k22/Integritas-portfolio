import { z } from "zod";

export const notionProjectDBSchema = z.object({
  projectId: z
    .string({
      required_error: "projectId is required.",
      invalid_type_error: "projectId must be a string.",
    })
    .trim()
    .uuid("projectId is invalid.")
    .min(1, "projectId is required.")
    .max(36, "Maximum 36 characters allowed."),
  epicId: z
    .string({
      required_error: "epicId is required.",
      invalid_type_error: "epicId must be a string.",
    })
    .trim()
    .uuid("epicId is invalid.")
    .min(1, "epicId is required.")
    .max(36, "Maximum 36 characters allowed."),
  notionDBId: z
    .string({
      required_error: "notion db id is required.",
      invalid_type_error: "notion db id must be a string.",
    })
    .trim()
    .min(1, "notion db id is required."),
  notionDBName: z
    .string({
      required_error: "notion db name is required.",
      invalid_type_error: "notion db name must be a string.",
    })
    .trim()
    .min(1, "notion db name is required."),
  notionIntegrationId: z
    .string({
      required_error: "notionIntegrationId is required.",
      invalid_type_error: "notionIntegrationId must be a string.",
    })
    .trim()
    .uuid("notionIntegrationId is invalid.")
    .min(1, "notionIntegrationId is required."),
  epicDB: z.boolean().default(false),
  taskDB: z.boolean().default(false),
  
});

export type NotionProjectDBSchema = z.infer<typeof notionProjectDBSchema>;
