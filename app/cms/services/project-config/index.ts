import schema from "@cms/schema";
import type { SchemaType } from "~/cms/types";
import { createContentType } from "~/models/content.server";
import {
  createProjectConfig,
  getCurrentProjectConfig,
} from "~/models/project-config.server";
import { arraysEqual, objectsEqual } from "./versioning-utils";

/*
  This function will compare the current schema version 
  with the new schema version
  and will return true or false if an update is needed
*/

export async function fetchLoadedProjectConfig() {
  const loadedProjectConfig = await getCurrentProjectConfig();
  return {
    loadedProjectConfig,
    existingContentTypes: loadedProjectConfig[0].contentTypes,
  };
}

/* Deep schema equality Versioning Method */
export async function checkForProjectConfigChanges(): Promise<{
  existingContentTypes: SchemaType;
  fileProjectConfig: SchemaType;
  hasChanges: boolean;
}> {
  const fileProjectConfig = schema;

  // sort schema by handle
  fileProjectConfig.sort((a, b) => a.handle.localeCompare(b.handle));

  // sort schema fields by handle and add details and isRequired if missing
  fileProjectConfig.forEach((contentType) => {
    contentType.fields = contentType.fields
      .sort((a, b) => a.handle.localeCompare(b.handle))
      .map((field) => ({
        ...field,
        description: field.description ?? "",
        isRequired: field.isRequired ?? false,
      }));
  });

  const { loadedProjectConfig, existingContentTypes } =
    await fetchLoadedProjectConfig();

  if (!loadedProjectConfig.length) {
    return {
      existingContentTypes,
      fileProjectConfig,
      hasChanges: true,
    };
  }

  return {
    existingContentTypes,
    fileProjectConfig,
    hasChanges: !arraysEqual(loadedProjectConfig, fileProjectConfig),
  };
}

export async function generateSchema() {
  const { loadedProjectConfig, existingContentTypes } =
    await fetchLoadedProjectConfig();

  const fileProjectConfig = schema.map((contentType) => ({
    ...contentType,
    fields: contentType.fields.map((field, index) => ({
      ...field,
      description: field.description ?? "",
      isRequired: field.isRequired ?? false,
      sortOrder: index,
    })),
  }));

  const newProjectConfigVersion = new Date().valueOf();

  if (!loadedProjectConfig.length) {
    console.log(`Creating new project config...`);
    await createProjectConfig(newProjectConfigVersion, fileProjectConfig);
    return { success: true };
  }

  if (arraysEqual(existingContentTypes, fileProjectConfig)) {
    console.log("No changes to project config");
    return { success: true };
  }

  console.log("Changes detected to project config...");
  // update project config version
  // iterate through content types and fields to identify changes

  fileProjectConfig.forEach(async (contentType) => {
    const existingContentType = existingContentTypes.find(
      (existingContentType) => existingContentType.handle === contentType.handle
    );

    if (!existingContentType) {
      // else create content type and fields
      console.log(`Creating new content type ${contentType.handle}...`);
      await createContentType(contentType, contentType.fields);
      return;
    }

    const fields = contentType.fields;
    const contentTypeData = {
      title: contentType.title,
      handle: contentType.handle,
      description: contentType.description,
    };

    const existingFields = existingContentType.fields;
    const existingContentTypeData = {
      title: existingContentType.title,
      handle: existingContentType.handle,
      description: existingContentType.description,
    };

    // update content type
    if (
      arraysEqual(existingFields, fields) &&
      objectsEqual(existingContentTypeData, contentTypeData)
    ) {
      // TODO: figure out how to avoid unnecessary updates
      console.log(`No changes to content type ${contentType.handle}`);
      return;
    }

    console.log(`Updating content type ${contentType.handle}...`);
  });

  return { success: true };
}

/* export async function generateSchema() {
  const promises = [];

  // add sortOrder to fields in schema
  const fileProjectConfig = schema.map((contentType) => ({
    ...contentType,
    fields: contentType.fields.map((field, index) => ({
      ...field,
      sortOrder: index,
    })),
  }));

  const existingContentTypes = await getAllContentTypes();

  // delete missing content types
  const contentTypesToDelete = existingContentTypes.filter(
    (existingContentType) =>
      !fileProjectConfig.some(
        (contentType) => contentType.handle === existingContentType.handle
      )
  );

  if (contentTypesToDelete.length) {
    console.log(`Deleting content types: `, contentTypesToDelete);
    promises.push(deleteContentTypes(contentTypesToDelete.map(({ id }) => id)));
  }

  // update existing content types
  fileProjectConfig.forEach(async (contentType) => {
    const existingContentType = existingContentTypes.find(
      (existingContentType) => existingContentType.handle === contentType.handle
    );

    if (!existingContentType) {
      // else create content type and fields
      console.log(`Creating new content type ${contentType.handle}...`);
      promises.push(createContentType(contentType, contentType.fields));
      return;
    }

    // if content type exists
    // check if it needs to be updated
    console.log(
      `Checking for changes to ${contentType.handle} content type...`
    );

    // check if fields need to be deleted
    const fieldsToDelete = existingContentType.fields.filter(
      (existingField) =>
        !contentType.fields.some(
          (field) => field.handle === existingField.handle
        )
    );

    if (fieldsToDelete.length) {
      console.log(
        `Deleting fields from ${existingContentType.handle}content type:`,
        fieldsToDelete.map(({ handle }) => handle)
      );
      promises.push(deleteFields(fieldsToDelete.map(({ id }) => id)));
    }

    const fieldsToCreate = contentType.fields.filter(
      (field) =>
        !existingContentType.fields.some(
          (existingField) => existingField.handle === field.handle
        )
    );

    fieldsToCreate.forEach((field) =>
      promises.push(createField(field, existingContentType.id))
    );

    // check if content type fields need to be updated
    contentType.fields.forEach(async (field) => {
      const existingField = existingContentType.fields.find(
        (existingField) => existingField.handle === field.handle
      );

      if (!existingField) return;

      if (
        field.title !== existingField.title ||
        field.description !== existingField.description ||
        field.type !== existingField.type ||
        field.isRequired !== existingField.isRequired ||
        field.sortOrder !== existingField.sortOrder
      ) {
        console.log(`Updating ${field.handle} field...`);
        promises.push(updateField(existingField.id, field));
      }
    });

    // check if content type needs to be updated
    // if so, update content type & all entries
    if (
      existingContentType.title !== contentType.title ||
      existingContentType.description !== contentType.description
    ) {
      console.log(`Updating ${contentType.handle} content type...`);
      promises.push(
        updateContentType({ ...contentType, id: existingContentType.id })
      );
    }

    return;
  });

  if (!promises.length) {
    console.log("No changes to project config.");
    return;
  }

  try {
    // update Content Types & Fields
    Promise.all(promises);
    return { success: true, message: "Project config updated." };
  } catch (error) {
    console.log(error);
    throw new Error("Error updating project config.");
  }
} */
