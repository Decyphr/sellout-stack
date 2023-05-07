import { z } from "zod";

export const createFieldSchema = z.object({
  _action: z.literal("createField"),
  type: z.string(),
  title: z.string(),
  sortOrder: z.string().refine((v) => !isNaN(Number(v))),
});

export const deleteFieldSchema = z.object({
  _action: z.literal("deleteField"),
  fieldId: z.string().min(1),
});
