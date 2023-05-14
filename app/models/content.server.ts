import type { ContentType, Entry, Field } from "@prisma/client";
import { prisma } from "~/db.server";

export type { ContentType, Entry, Field } from "@prisma/client";

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

type FieldData = Pick<Field, "title" | "handle" | "type" | "sortOrder"> & {
  description?: Field["description"];
  isRequired?: Field["isRequired"];
};
// Content Type
export async function getAllContentTypes() {
  return prisma.contentType.findMany({
    orderBy: { title: "asc" },
    select: {
      id: true,
      title: true,
      handle: true,
      description: true,
      fields: true,
      entries: true,
    },
  });
}

export async function getContentTypeById(id: ContentType["id"]) {
  return prisma.contentType.findUnique({
    where: { id },
    select: { id: true, title: true, entries: true },
  });
}

// used in generator
export async function getContentTypeByHandle(handle: ContentType["handle"]) {
  return prisma.contentType.findUnique({
    where: { handle },
    select: { id: true },
  });
}

export async function createContentType(
  contentType: Pick<ContentType, "title" | "handle"> & {
    description?: ContentType["description"];
  },
  fields: FieldData[]
) {
  return prisma.contentType.create({
    data: {
      ...contentType,
      fields: {
        create: fields,
      },
    },
  });
}

export async function updateContentType(
  contentType: Pick<ContentType, "id" | "title" | "handle"> & {
    description?: ContentType["description"];
  }
) {
  return prisma.contentType.update({
    where: { id: contentType.id },
    data: {
      title: contentType.title,
      description: contentType.description,
    },
  });
}

export async function deleteContentTypes(
  contentTypesToDelete: ContentType["id"][]
) {
  return prisma.contentType.deleteMany({
    where: {
      id: {
        in: contentTypesToDelete,
      },
    },
  });
}

// Fields
export async function createField(
  field: FieldData,
  contentTypeId: ContentType["id"]
) {
  // only create a field if content type is being updated
  return prisma.field.create({
    data: {
      contentTypeId,
      ...field,
    },
  });
}

export async function updateField(
  fieldId: Field["id"],
  fieldToUpdate: FieldData
) {
  return prisma.field.update({
    where: { id: fieldId },
    data: {
      title: fieldToUpdate.title,
      handle: fieldToUpdate.handle,
      type: fieldToUpdate.type,
      description: fieldToUpdate.description,
      isRequired: fieldToUpdate.isRequired,
      sortOrder: fieldToUpdate.sortOrder,
    },
  });
}

export async function deleteFields(fieldsToDelete: Field["id"][]) {
  return prisma.field.deleteMany({
    where: {
      id: {
        in: fieldsToDelete,
      },
    },
  });
}

// Entries
export async function getEntryById(id: Entry["id"]) {
  return prisma.entry.findUnique({
    where: { id },
    select: {
      id: true,
      fields: {
        select: {
          id: true,
          field: true,
        },
        orderBy: { field: { sortOrder: "asc" } },
      },
    },
  });
}

export async function createEntry(contentTypeId: ContentType["id"]) {
  const fields = await prisma.field.findMany({
    where: { contentTypeId },
    select: { id: true },
  });

  return prisma.entry.create({
    data: {
      contentTypeId,
      fields: {
        create: fields.map((field) => ({ fieldId: field.id })),
      },
    },
  });
}

// returns a promise for each entry
export async function addNewFieldsToEntries(
  contentTypeId: ContentType["id"],
  fieldsToCreate: Field["id"][]
) {
  const entries = await prisma.entry.findMany({
    where: { contentTypeId },
  });

  try {
    await Promise.all(
      entries.map((entry) =>
        prisma.entry.update({
          where: { id: entry.id },
          data: {
            fields: {
              create: fieldsToCreate.map((fieldId) => ({ fieldId })),
            },
          },
        })
      )
    );

    return;
  } catch (error) {
    console.error(error);
    throw new Error("Error adding new fields to entries");
  }
}
