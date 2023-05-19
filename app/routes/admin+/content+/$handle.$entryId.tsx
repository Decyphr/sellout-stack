import { useForm } from "@conform-to/react";
import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { useFetcher } from "react-router-dom";
import invariant from "tiny-invariant";
import { z, type ZodSchema } from "zod";
import { Field } from "~/components/form";
import { RouteTitle } from "~/components/route-title";
import { Button } from "~/components/ui/button";
import { deleteEntry, getEntryById } from "~/models/content.server";
import { prisma } from "~/services/db.server";
import { toCamelCase } from "~/utils/formatters";

export const loader = async ({ params }: LoaderArgs) => {
  invariant(params.entryId, "Missing content type id");

  const entry = await getEntryById(params.entryId);

  if (!entry) return redirect("/admin/content");

  const titleSchema = z.string().min(1);

  const dynamicFieldSchemas: { [key: string]: ZodSchema } = {};

  for (const field of entry.fields) {
    dynamicFieldSchemas[field.id] = z.string().min(1);
  }

  const entrySchema = z.object({
    title: titleSchema,
    ...dynamicFieldSchemas,
  });

  return json({ entry, entrySchema });
};

export const action = async ({ params, request }: ActionArgs) => {
  invariant(params.entryId, "Missing entry id");
  const formData = await request.clone().formData();

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
  const { entry, entrySchema } = useLoaderData<typeof loader>();

  const updateEntryFetcher = useFetcher();

  const [form, fields] = useForm({
    id: `${entry.id}-form`,
    onSubmit: async (data) => {
      console.log(data);
    },
  });

  return (
    <div>
      <RouteTitle title={entry.title}>
        <Form method="DELETE">
          <Button type="submit" variant="destructive">
            Delete
          </Button>
        </Form>
        {/* <Button onClick={updateEntry}>Save Changes</Button> */}
      </RouteTitle>
      <div className="flex justify-between">
        <Form
          method="POST"
          className="flex-1 max-w-5xl grid gap-4 pb-8"
          name="updateEntryForm"
          {...form.props}
        >
          <Field
            id="title"
            label="Title"
            errors={fields.title.errors}
            required={fields.title.required}
            defaultValue={entry.title ?? ""}
          />
          {entry.fields.map((fieldValue) => (
            <div key={fieldValue.id}>
              {fieldValue.field.type === "text" ? (
                <Field
                  id={fieldValue.id}
                  label={fieldValue.field.title}
                  errors={fields[fieldValue.id].errors}
                  defaultValue={fieldValue.textValue ?? ""}
                  required={fieldValue.field.isRequired ?? false}
                />
              ) : null}
            </div>
          ))}
          <Button type="submit">Save Changes</Button>
        </Form>
        <div className="w-[280px] my-4 bg-foreground/10 p-4 rounded-sm">
          Slug: {entry.slug}
        </div>
      </div>
    </div>
  );
}
