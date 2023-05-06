import { z } from "zod";

export const createFieldSchema = z.object({
  _action: z.literal("createField"),
  contentTypeId: z.string(),
  type: z.string(),
  title: z.string(),
  sortOrder: z.string().refine((v) => !isNaN(Number(v))),
});
