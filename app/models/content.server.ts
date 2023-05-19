import type { Collection, Entry, Field } from "@prisma/client";
import { prisma } from "~/services/db.server";
import { toCamelCase } from "~/utils/formatters";

export type { Collection, Entry, Field, FieldValue } from "@prisma/client";

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

type FieldData = Pick<
  Field,
  "title" | "type" | "sortOrder" | "description" | "isRequired"
>;

// Content Type
export async function getAllCollections() {
  return prisma.collection.findMany({
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

export async function getCollectionById(id: Collection["id"]) {
  return prisma.collection.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      entries: true,
      fields: {
        orderBy: { sortOrder: "asc" },
        select: {
          id: true,
          title: true,
          type: true,
          isRequired: true,
          sortOrder: true,
        },
      },
    },
  });
}

// used in generator
export async function getCollectionByHandle(handle: Collection["handle"]) {
  return prisma.collection.findUnique({
    where: { handle },
    select: { id: true },
  });
}

export async function createCollection(
  collection: Pick<Collection, "title" | "description">
) {
  const handle = toCamelCase(collection.title);

  return prisma.collection.create({
    data: {
      ...collection,
      handle,
    },
  });
}

export async function updateCollection(
  collection: Pick<Collection, "id" | "title" | "description">
) {
  return prisma.collection.update({
    where: { id: collection.id },
    data: {
      title: collection.title,
      description: collection.description,
    },
  });
}

export async function updateCollectionFields(
  collectionId: Collection["id"],
  fieldsToUpdate: Pick<Field, "id" | "sortOrder">[]
) {
  return prisma.collection.update({
    where: { id: collectionId },
    data: {
      fields: {
        updateMany: fieldsToUpdate.map((field) => ({
          where: { id: field.id },
          data: { sortOrder: field.sortOrder },
        })),
      },
    },
  });
}

export async function deleteCollections(
  collectionsToDelete: Collection["id"][]
) {
  return prisma.collection.deleteMany({
    where: {
      id: {
        in: collectionsToDelete,
      },
    },
  });
}

// Fields
export async function createField(
  field: FieldData,
  collectionId: Collection["id"]
) {
  const handle = toCamelCase(field.title);

  const existingContentEntries = await prisma.entry.findMany({
    where: { collectionId },
  });

  // only create a field if content type is being updated
  return prisma.field.create({
    data: {
      collectionId,
      handle,
      ...field,
      values: {
        create: existingContentEntries.map((entry) => ({ entryId: entry.id })),
      },
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
    include: {
      fields: {
        include: {
          field: {
            select: {
              title: true,
              handle: true,
              type: true,
              isRequired: true,
              description: true,
            },
          },
        },
        orderBy: { field: { sortOrder: "asc" } },
      },
    },
  });
}

export async function createEntry(collectionId: Collection["id"]) {
  const fields = await prisma.field.findMany({
    where: { collectionId },
    select: { id: true },
  });

  const title = "Untitled Entry";
  const slug = toCamelCase(title);

  return prisma.entry.create({
    data: {
      title,
      slug,
      collectionId,
      fields: {
        create: fields.map((field) => ({ fieldId: field.id })),
      },
    },
  });
}

export async function deleteEntry(entryId: Entry["id"]) {
  return prisma.entry.delete({ where: { id: entryId } });
}
