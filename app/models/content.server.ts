import type { Collection, Entry, Field } from "@prisma/client";
import { toCamelCase } from "~/cms/lib/utils/formatters";
import { prisma } from "~/db.server";

export type { Collection, Entry, Field } from "@prisma/client";

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
          handle: true,
          type: true,
          description: true,
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
  collection: Pick<Collection, "title"> & {
    description?: Collection["description"];
  },
  fields: FieldData[]
) {
  const handle = toCamelCase(collection.title);

  return prisma.collection.create({
    data: {
      ...collection,
      handle,
      fields: {
        create: fields,
      },
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
  // only create a field if content type is being updated
  return prisma.field.create({
    data: {
      collectionId,
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

export async function createEntry(collectionId: Collection["id"]) {
  const fields = await prisma.field.findMany({
    where: { collectionId },
    select: { id: true },
  });

  return prisma.entry.create({
    data: {
      collectionId,
      fields: {
        create: fields.map((field) => ({ fieldId: field.id })),
      },
    },
  });
}

// returns a promise for each entry
export async function addNewFieldsToEntries(
  collectionId: Collection["id"],
  fieldsToCreate: Field["id"][]
) {
  const entries = await prisma.entry.findMany({
    where: { collectionId },
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
