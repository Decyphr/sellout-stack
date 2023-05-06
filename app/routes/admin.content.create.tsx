import { ActionArgs, json, redirect } from "@remix-run/node";
import { makeDomainFunction } from "domain-functions";
import { performMutation } from "remix-forms";
import { z } from "zod";
import { RouteTitle } from "~/components/route-title";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

import { Form } from "~/form";
import { createContentType } from "~/models/content.server";

export const schema = z.object({
  title: z.string().min(1, "Provide a title for this content type"),
});

export const mutation = makeDomainFunction(schema)(async (values) => {
  const handle = values.title.toLowerCase().replace(/\s/g, "-");
  try {
    const contentType = await createContentType(values.title, handle);

    return { ...values, handle: contentType.handle };
  } catch (error) {
    console.error(error);

    throw "An error occurred while creating the content type.";
  }
});

export const action = async ({ request }: ActionArgs) => {
  const result = await performMutation({
    request,
    schema,
    mutation,
  });

  if (!result.success) {
    return json(result, { status: 400 });
  }

  return redirect(`/admin/content/${result.data.handle}/builder`);
};
export default function CreateContentRoute() {
  return (
    <Form schema={schema}>
      {({ Field, Errors, register }) => (
        <>
          <RouteTitle title="Create Content Type" />
          <div className="mx-auto max-w-4xl space-y-4">
            <Field name="title">
              {({ Errors }) => (
                <div className="space-y-2">
                  <Label htmlFor="title">
                    Title <span className="text-red-400">*</span>
                  </Label>
                  <Input {...register("title")} />
                  <Errors className="text-red-500" />
                </div>
              )}
            </Field>
            <div className="flex justify-end">
              <Button type="submit" className="h-12">
                Save and Edit Fields
              </Button>
            </div>
            <Errors />
          </div>
        </>
      )}
    </Form>
  );
}
