import type { ContentType, Field } from "~/models/content.server";

// schema type based on partial content type and field types with optional isRequired and description

export type SchemaType = Array<
  Pick<ContentType, "title" | "handle"> & {
    description?: ContentType["description"];
    fields: Array<
      Pick<Field, "title" | "handle" | "type"> & {
        description?: Field["description"];
        isRequired?: Field["isRequired"];
      }
    >;
  }
>;
