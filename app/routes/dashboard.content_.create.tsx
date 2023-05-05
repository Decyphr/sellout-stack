import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { makeDomainFunction } from "domain-functions";
import { z } from "zod";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

import { Form } from "~/form";
import { formAction } from "~/form-action.server";

export const schema = z.object({
  firstName: z.string().min(1),
  email: z.string().min(1).email(),
});

export const mutation = makeDomainFunction(schema)(
  async (values) =>
    console.log(values) /* or anything else, like saveMyValues(values) */
);

export const loader = async ({}: LoaderArgs) => {
  return json({});
};

export const action = async ({ request }: ActionArgs) =>
  formAction({
    request,
    schema,
    mutation,
    successPath: "/dashboard/content",
  });

export default function CreateContentRoute() {
  return (
    <>
      <div>
        <h2 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          Create New Content Type
        </h2>
      </div>
      <Form className="space-y-4 w-full md:w-96" schema={schema}>
        {({ Field, Errors, Button, register }) => (
          <>
            <div className="flex space-x-4">
              <Field name="firstName">
                {({ Errors }) => (
                  <div className="space-y-1">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input {...register("firstName")} />
                    <Errors className="text-red-500" />
                  </div>
                )}
              </Field>
              <Field name="email">
                {({ Errors }) => (
                  <div className="space-y-1">
                    <Label htmlFor="email" className="mb-2">
                      Email
                    </Label>
                    <Input {...register("email")} />
                    <Errors className="text-red-500" />
                  </div>
                )}
              </Field>
            </div>
            <Errors />
            <Button />
          </>
        )}
      </Form>
    </>
  );
}
