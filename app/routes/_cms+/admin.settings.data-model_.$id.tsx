import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useState } from "react";
import invariant from "tiny-invariant";
import { CollectionFieldSettings } from "~/cms/components/content-type-field-settings";
import { RouteTitle } from "~/cms/components/route-title";
import { Button } from "~/cms/components/ui/button";
import { Field, getCollectionById } from "~/models/content.server";

// drag and drop
import {
  DragDropContext,
  Draggable,
  Droppable,
  type DropResult,
} from "@hello-pangea/dnd";

export const loader = async ({ params }: LoaderArgs) => {
  invariant(params.id, "Missing params.id");
  const collection = await getCollectionById(params.id);

  if (!collection) return redirect("/admin/settings/data-model");
  return json({ collection });
};

export const action = async ({}: ActionArgs) => {
  return redirect("");
};

export default function CollectionSettingsRoute() {
  const { collection } = useLoaderData();
  const [hasChanges, setHasChanges] = useState(false);

  const layout = collection.fields.sort(
    (a: Field, b: Field) => (a.sortOrder = b.sortOrder)
  );

  const [fieldLayout, setFieldLayout] = useState(layout);

  const onDragEnd = (result: DropResult) => {
    console.log(result);
    if (!result.destination) return;
    const { source, destination } = result;

    const newFields = [...collection.fields];
    const [removed] = newFields.splice(source.index, 1);
    newFields.splice(destination.index, 0, removed);

    if (!hasChanges) setHasChanges(true);
  };

  return (
    <div>
      <RouteTitle
        title={collection.title}
        backLink={"/admin/settings/data-model"}
      >
        <Button variant="destructive">Delete</Button>
        <Button disabled={!hasChanges}>Save Changes</Button>
      </RouteTitle>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="fields">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="max-w-5xl grid grid-cols-1 gap-4"
            >
              {fieldLayout.map((field: Field, index: number) => (
                <Draggable key={field.id} draggableId={field.id} index={index}>
                  {(provided) => (
                    <CollectionFieldSettings
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      field={field}
                    />
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}
