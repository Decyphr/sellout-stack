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
    select: { id: true, title: true, handle: true },
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
  title: ContentType["title"],
  handle: ContentType["handle"],
  fields: FieldData[]
) {
  return prisma.contentType.create({
    data: {
      title,
      handle,
      fields: {
        create: fields.map((field) => ({ ...field })),
      },
    },
  });
}

export async function deleteContentType(id: ContentType["id"]) {
  return prisma.contentType.delete({ where: { id } });
}

export async function updateContentTypeFields(
  contentTypeId: string,
  fields: FieldData[]
) {
  // Get the existing fields for the Content Type
  const existingFields = await prisma.field.findMany({
    where: { contentTypeId },
    select: { id: true, handle: true },
  });

  // Filter out the fields that don't exist anymore
  const fieldsToDelete = existingFields.filter(
    (existingField) =>
      !fields.some((field) => field.handle === existingField.handle)
  );

  // Delete the fields that don't exist anymore
  await Promise.all(
    fieldsToDelete.map((field) =>
      prisma.field.delete({ where: { id: field.id } })
    )
  );

  // Create or update the remaining fields
  await Promise.all(
    fields.map((field) => {
      const existingField = existingFields.find(
        (existingField) => existingField.handle === field.handle
      );

      if (existingField) {
        console.log("Updating field: ", field.handle);
        prisma.field.update({
          where: { id: existingField.id },
          data: field,
        });
      } else {
        console.log("Creating field: ", field.handle);

        prisma.field.create({
          data: { ...field, contentTypeId },
        });
      }
    })
  );
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
