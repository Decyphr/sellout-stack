import {
  createContentType,
  getContentTypeByHandle,
  updateContentTypeFields,
} from "~/models/content.server";
import cmsSchema from "./schema";

export function generateSchema() {
  const schema: ContentType[] = cmsSchema;

  Promise.all(
    schema.map(async (contentType) => {
      // add sortOrder to fields
      const sortedFields = contentType.fields.map((field, index) => ({
        ...field,
        sortOrder: index,
      }));

      // create content type
      const existingContentType = await getContentTypeByHandle(
        contentType.handle
      );

      if (existingContentType) {
        console.log("Content type exists. Updating fields...");
        // update fields
        try {
          await updateContentTypeFields(existingContentType.id, sortedFields);
          return;
        } catch (error) {
          console.error(error);
        }
      }

      try {
        await createContentType(
          contentType.title,
          contentType.handle,
          sortedFields
        );
        return;
      } catch (error) {
        console.error(error);
      }
    })
  );

  console.log("Schema generated");

  return { success: true };
}
