import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useLoaderData, useSubmit } from "@remix-run/react";
import { useRef } from "react";
import invariant from "tiny-invariant";
import { DynamicFieldRenderer } from "~/components/form";
import { RouteTitle } from "~/components/route-title";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { deleteEntry, getEntryById } from "~/models/content.server";
import { prisma } from "~/services/db.server";
import { toCamelCase } from "~/utils/formatters";

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
    // TODO: Add dynamic field validation
    // update entry field values

    const title = formData.get("title") as string;
    const slug = toCamelCase(title);
    const fields = Object.fromEntries(formData.entries());

    try {
      await prisma.entry.update({
        where: { id: params.entryId },
        data: {
          title,
          slug,
          fields: {
            update: Object.entries(fields)
              .filter(([key, value]) => key !== "title")
              .map(([key, value]) => {
                return {
                  where: { id: key },
                  data: { textValue: typeof value === "string" ? value : "" },
                };
              }),
          },
        },
      });
    } catch (error) {
      console.error(error);
      throw json({ error: "Error updating entry" }, { status: 400 });
    }
    return redirect(`/admin/content/${params.id}`);
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
      <RouteTitle title={entry.title}>
        <Form method="DELETE">
          <Button type="submit" variant="destructive">
            Delete
          </Button>
        </Form>
        <Button onClick={updateEntry}>Save Changes</Button>
      </RouteTitle>
      <div className="flex justify-between">
        <Form
          ref={updateEntryForm}
          method="POST"
          className="flex-1 max-w-5xl grid gap-4 pb-8"
        >
          <div className="space-y-2">
            <Label htmlFor="title" className="text-right">
              Title
            </Label>
            <Input
              id="title"
              name="title"
              className="col-span-3"
              required
              defaultValue={entry.title ?? ""}
            />
          </div>
          <DynamicFieldRenderer fields={entry.fields} />
        </Form>
        <div className="w-[280px] my-4 bg-foreground/10 p-4 rounded-sm">
          Slug: {entry.slug}
        </div>
      </div>
    </div>
  );
}
