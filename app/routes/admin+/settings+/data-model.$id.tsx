import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import {
  Form,
  Link,
  Outlet,
  useLoaderData,
  useNavigation,
  useSubmit,
} from "@remix-run/react";
import { useEffect, useState } from "react";
import invariant from "tiny-invariant";
import { RouteTitle } from "~/components/route-title";
import { Button } from "~/components/ui/button";
import {
  deleteCollections,
  deleteFields,
  getCollectionById,
  updateCollectionFields,
} from "~/models/content.server";

// drag and drop
import {
  DragDropContext,
  Draggable,
  Droppable,
  type DropResult,
} from "@hello-pangea/dnd";

import { Edit, GripVertical, Plus, X } from "lucide-react";
import { z } from "zod";
import DeleteCollection from "~/routes/resources+/delete-collection";

import { DeleteField } from "~/routes/resources+/delete-field";
import useSpinDelay from "~/utils/spin-delay";

export const loader = async ({ params }: LoaderArgs) => {
  invariant(params.id, "Missing params.id");
  const collection = await getCollectionById(params.id);

  if (!collection) return redirect("/admin/settings/data-model");
  return json({ collection, fields: collection.fields });
};

export const action = async ({ request, params }: ActionArgs) => {
  invariant(
    params.id,
    "A collection id is required to update a collection's fields"
  );

  const formData = await request.formData();
  const _action = formData.get("_action");

  if (request.method === "DELETE") {
    // delete collection, and all related entries, fields, and field values
    if (_action === "delete-collection") {
      try {
        await deleteCollections([params.id]);
        return redirect("/admin/settings/data-model");
      } catch (error) {
        console.error(error);
        throw json({ error }, { status: 400 });
      }
    }

    if (_action === "delete-field") {
      const fieldId = formData.get("fieldId");
      if (!fieldId || typeof fieldId !== "string") {
        console.error("Missing fieldId");
        throw json({ error: "Missing fieldId" }, { status: 400 });
      }

      try {
        // delete field, and all related field values
        await deleteFields([fieldId]);
      } catch (error) {
        console.error(error);
        throw json({ error }, { status: 400 });
      }
    }
  }

  if (_action === "update-collection-fields") {
    const fieldLayout = formData.get("fieldLayout");

    if (!fieldLayout || typeof fieldLayout !== "string") {
      throw json({ error: "Missing fieldLayout" }, { status: 400 });
    }

    const schema = z.array(
      z.object({
        id: z.string(),
        sortOrder: z.number(),
      })
    );

    try {
      const validFieldLayout = schema.parse(JSON.parse(fieldLayout));
      // update collection's fields sortOrder
      updateCollectionFields(params.id, validFieldLayout);

      // update all related entries' fields
      return { success: true };
    } catch (error) {
      console.error(error);
      throw json({ error }, { status: 400 });
    }
  }
};

export default function CollectionSettingsRoute() {
  const { collection, fields } = useLoaderData<typeof loader>();
  const [fieldLayout, setFieldLayout] = useState(fields);

  // TODO: Integrate this for changes to the Collection itself (not fields)
  const [hasChanges, setHasChanges] = useState(false);

  const submit = useSubmit();
  const navigation = useNavigation();

  const isUpdatingFieldOrder = useSpinDelay(navigation.state === "submitting");

  useEffect(() => {
    setFieldLayout(fields);
  }, [fields]);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const { source, destination } = result;

    if (destination.droppableId === "fields") {
      const newFieldLayout = fieldLayout.map((field, index) => {
        if (index === source.index) {
          // update the dragged field's sortOrder
          return { ...field, sortOrder: destination.index };
        }

        // TODO: Refactor this to be more efficient
        // update the fields that were moved down
        if (
          field.sortOrder >= destination.index &&
          field.sortOrder < source.index
        ) {
          return { ...field, sortOrder: field.sortOrder + 1 };
        }

        if (
          field.sortOrder <= destination.index &&
          field.sortOrder > source.index
        ) {
          return { ...field, sortOrder: field.sortOrder - 1 };
        }

        return field;
      });

      setFieldLayout(newFieldLayout.sort((a, b) => a.sortOrder - b.sortOrder));

      setTimeout(() => {
        let formData = new FormData();
        formData.append("_action", "update-collection-fields");
        formData.append("fieldLayout", JSON.stringify(newFieldLayout));

        submit(formData, { method: "PATCH" });
      }, 10);
    }

    return;
  };

  return (
    <div>
      <RouteTitle
        title={collection.title}
        backLink={"/admin/settings/data-model"}
      >
        <DeleteCollection id={collection.id}>
          <Button
            type="submit"
            variant="destructive"
            name="_action"
            value="delete-collection"
          >
            Delete
          </Button>
        </DeleteCollection>
        <Form method="patch">
          <Button
            type="submit"
            name="_action"
            value="update-collection"
            disabled={!hasChanges}
          >
            Save Changes
          </Button>
        </Form>
      </RouteTitle>
      <div className="max-w-5xl space-y-4">
        <div>
          <h2>
            Fields &amp; Layout &nbsp;
            <em className="text-yellow-500 text-sm">
              {isUpdatingFieldOrder ? "Saving..." : "Saves Automatically"}
            </em>
          </h2>
        </div>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="fields">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="flex flex-col space-y-4"
              >
                {fieldLayout.map((field, index) => (
                  <Draggable
                    key={field.id}
                    draggableId={field.id}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="rounded-sm flex justify-between items-center p-4 bg-foreground/10 hover:bg-foreground/20 text-foreground/80 hover:text-foreground transition-colors cursor-grab active:cursor-grabbing"
                      >
                        <div className="flex items-center justify-start space-x-4">
                          <GripVertical className="w-5 h-5" />
                          <p>
                            {field.title} - {field.sortOrder}
                          </p>
                        </div>
                        <div className="flex justify-center items-center space-x-2">
                          <Link to={field.id}>
                            <Button variant="ghost" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </Link>

                          <DeleteField id={field.id}>
                            <Button variant="ghost" size="sm">
                              <X className="w-4 h-4" />
                            </Button>
                          </DeleteField>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
        <div>
          <Link to="create">
            <Button variant="ghost" className="w-full">
              <Plus className="w-5 h-5 mr-2" /> Create Field
            </Button>
          </Link>
        </div>
        <Outlet />
      </div>
    </div>
  );
}
