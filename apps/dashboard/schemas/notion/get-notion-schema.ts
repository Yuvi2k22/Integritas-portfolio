import { z } from "zod";

export const getNotionSchema = z.object({
  projectId: z
    .string({
      required_error: "projectId is required.",
      invalid_type_error: "projectId must be a string.",
    })
    .trim()
    .uuid("projectId is invalid.")
    .min(1, "projectId is required.")
    .max(36, "Maximum 36 characters allowed."),
});

export type GetNotionSchema = z.infer<typeof getNotionSchema>;
