import {
  createContentType,
  deleteContentType,
  getAllContentTypes,
  updateContentTypeFields,
} from "~/models/content.server";
import cmsSchema from "./schema";

export async function generateSchema() {
  const schema: ContentType[] = cmsSchema;

  const existingContentTypes = await getAllContentTypes();

  const contentTypesToDelete = existingContentTypes.filter(
    (existingContentType) =>
      !schema.some(
        (contentType) => contentType.handle === existingContentType.handle
      )
  );

  console.log(
    "Deleting Content Types: ",
    contentTypesToDelete.map((ct) => ct.handle)
  );
  await Promise.all(
    contentTypesToDelete.map((contentType) => deleteContentType(contentType.id))
  );

  schema.forEach(async (contentType) => {
    // add sortOrder to fields
    const sortedFields = contentType.fields.map((field, index) => ({
      ...field,
      sortOrder: index,
    }));

    // if content type exists - update fields
    const existingContentType = existingContentTypes.find(
      (existingContentType) => contentType.handle === existingContentType.handle
    );

    if (existingContentType) {
      console.log(
        `Content type ${contentType.handle} exists. Updating fields...`
      );

      try {
        await updateContentTypeFields(existingContentType.id, sortedFields);
      } catch (error) {
        console.error(error);
      }

      return;
    }

    // else create content type and fields
    try {
      console.log(`Creating new content type ${contentType.handle}...`);
      await createContentType(
        contentType.title,
        contentType.handle,
        sortedFields
      );
    } catch (error) {
      console.error(error);
    }

    return;
  });

  return { success: true };
}
