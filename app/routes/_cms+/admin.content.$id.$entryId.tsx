import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import { RouteTitle } from "~/cms/components/route-title";
import { Button } from "~/cms/components/ui/button";
import { deleteEntry, getEntryById } from "~/models/content.server";

export const loader = async ({ params }: LoaderArgs) => {
  invariant(params.entryId, "Missing content type id");

  const entry = await getEntryById(params.entryId);

  if (!entry) return redirect("/admin/content");

  return json({ entry });
};

export const action = async ({ params }: ActionArgs) => {
  invariant(params.entryId, "Missing entry id");
  try {
    await deleteEntry(params.entryId);
    return redirect(`/admin/content/${params.id}`);
  } catch (error) {
    console.error(error);
    throw "Error deleting entry";
  }
};

export default function EntryEditRoute() {
  const { entry } = useLoaderData<typeof loader>();

  return (
    <div>
      <RouteTitle title="Entry">
        <Form method="delete">
          <Button type="submit" variant="destructive">
            Delete
          </Button>
        </Form>
      </RouteTitle>
      <ul>
        {entry.fields
          .sort((a, b) => a.field.sortOrder - b.field.sortOrder)
          .map((field) => (
            <li key={field.id}>
              {field.field.title} - {field.field.type} - {field.field.sortOrder}
            </li>
          ))}
      </ul>
    </div>
  );
}
