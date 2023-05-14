import { ContentType, Field } from "@prisma/client";
import { prisma } from "~/db.server";

export async function getCurrentProjectConfig() {
  return prisma.projectConfig.findMany({
    orderBy: {
      version: "desc",
    },
    take: 1,
    select: {
      contentTypes: {
        select: {
          title: true,
          handle: true,
          description: true,
          fields: {
            select: {
              title: true,
              handle: true,
              type: true,
              description: true,
              isRequired: true,
            },
          },
        },
      },
    },
  });
}

export async function createProjectConfig(
  version: number,
  schema: Array<
    Pick<ContentType, "title" | "handle"> & {
      description?: ContentType["description"];
      fields: Array<
        Pick<Field, "title" | "handle" | "type" | "sortOrder"> & {
          description?: Field["description"];
          isRequired?: Field["isRequired"];
        }
      >;
    }
  >
) {
  return prisma.projectConfig.create({
    data: {
      version,
      contentTypes: {
        create: schema.map((contentType) => ({
          title: contentType.title,
          handle: contentType.handle,
          description: contentType.description,
          fields: {
            create: contentType.fields.map((field) => ({
              title: field.title,
              handle: field.handle,
              type: field.type,
              description: field.description ?? "",
              isRequired: field.isRequired ?? false,
              sortOrder: field.sortOrder,
            })),
          },
        })),
      },
    },
  });
}
