import { z } from "zod";

const notionDbItemSchema = z.object({
  notionDBName: z
    .string({
      required_error: "name is required.",
      invalid_type_error: "name must be a string.",
    })
    .trim()
    .min(1, "name cannot be empty."),
  notionDBId: z
    .string({
      required_error: "id is required.",
      invalid_type_error: "id must be a string.",
    })
    .trim(),
  epicDB: z.boolean({
    required_error: "epicDb is required.",
    invalid_type_error: "epicDb must be a boolean.",
  }),
  taskDB: z.boolean({
    required_error: "taskDb is required.",
    invalid_type_error: "taskDb must be a boolean.",
  }),
  pageProjectId: z
    .string({
      required_error: "pageProjectId is required.",
      invalid_type_error: "pageProjectId must be a string.",
    })
    .trim()
    .optional(),
});
export const addNotionProjectDBSchema = z.object({
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
  notionDb: z
    .array(notionDbItemSchema)
    .length(2, "notionDb must contain feature and task items."),
});

export type AddNotionProjectDBSchema = z.infer<typeof addNotionProjectDBSchema>;
