type FieldType =
  | "text"
  | "boolean"
  | "number"
  | "richtext"
  | "select"
  | "media"
  | "datetime"
  | "relation";

// based on our prisma schema
interface ContentType {
  title: string;
  handle: string;
  description?: string;
  fields: Field[];
}

interface Field {
  title: string;
  handle: string;
  type: string;
  description?: string;
  isRequired?: boolean;
}

interface FieldOptions {
  // TODO: add options for all different field types
}
