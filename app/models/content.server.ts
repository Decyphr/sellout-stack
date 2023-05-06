import type { ContentType, Field } from "@prisma/client";
import { prisma } from "~/db.server";

export type { ContentType, Field } from "@prisma/client";

export const FIELD_TYPES = [
  "boolean",
  "text",
  "number",
  "richtext",
  "select",
  "media",
  "datetime",
  "relation",
];

// Content Type
export async function getAllContentTypes() {
  return prisma.contentType.findMany({
    orderBy: { title: "asc" },
    select: { id: true, title: true, handle: true },
  });
}

export async function getContentTypeById(id: ContentType["id"]) {
  return prisma.contentType.findUnique({
    where: { id },
    select: { id: true, title: true },
  });
}

export async function createContentType(
  title: ContentType["title"],
  handle: ContentType["handle"]
) {
  return prisma.contentType.create({
    data: { title, handle },
  });
}

// Fields
export async function getFieldsByContentTypeId(id: ContentType["id"]) {
  return prisma.field.findMany({
    where: { contentTypeId: id },
    orderBy: { sortOrder: "asc" },
    select: { id: true, title: true, type: true, sortOrder: true },
  });
}

export async function createField(
  contentTypeId: ContentType["id"],
  field: Pick<Field, "title" | "handle" | "type" | "sortOrder">
) {
  return prisma.field.create({
    data: {
      title: field.title,
      handle: field.handle,
      type: field.type,
      sortOrder: field.sortOrder,
      contentTypeId,
    },
  });
}
