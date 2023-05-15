import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useLoaderData, useSubmit } from "@remix-run/react";
import { useRef } from "react";
import invariant from "tiny-invariant";
import { DynamicField } from "~/cms/components/forms/fields";
import { RouteTitle } from "~/cms/components/route-title";
import { Button } from "~/cms/components/ui/button";
import { deleteEntry, getEntryById } from "~/models/content.server";

export const loader = async ({ params }: LoaderArgs) => {
  invariant(params.entryId, "Missing content type id");

  const entry = await getEntryById(params.entryId);

  if (!entry) return redirect("/admin/content");

  return json({ entry });
};

export const action = async ({ params, request }: ActionArgs) => {
  invariant(params.entryId, "Missing entry id");
  const formData = await request.formData();

  if (request.method === "POST") {
    // update entry field values
    console.log(Object.fromEntries(formData.entries()));
    return { success: true };
  }

  if (request.method === "DELETE") {
    try {
      await deleteEntry(params.entryId);
      return redirect(`/admin/content/${params.id}`);
    } catch (error) {
      console.error(error);
      throw "Error deleting entry";
    }
  }

  return { success: false };
};

export default function EntryEditRoute() {
  const { entry } = useLoaderData<typeof loader>();

  const submit = useSubmit();
  const updateEntryForm = useRef(null);

  function updateEntry() {
    submit(updateEntryForm.current);
  }

  return (
    <div>
      <RouteTitle title="Entry">
        <Form method="DELETE">
          <Button type="submit" variant="destructive">
            Delete
          </Button>
        </Form>
        <Button onClick={updateEntry}>Save Changes</Button>
      </RouteTitle>
      <Form
        ref={updateEntryForm}
        method="POST"
        className="max-w-5xl grid gap-4 pb-8"
      >
        {entry.fields.map((field) => (
          <DynamicField key={field.id} field={field.field} values={field} />
        ))}
      </Form>
    </div>
  );
}
