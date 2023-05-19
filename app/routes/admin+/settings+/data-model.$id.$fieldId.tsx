import type { DataFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import {
  Form,
  Link,
  useLoaderData,
  useNavigation,
  useParams,
} from "@remix-run/react";
import { X } from "lucide-react";
import invariant from "tiny-invariant";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Separator } from "~/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "~/components/ui/sheet";
import { prisma } from "~/services/db.server";
import useSpinDelay from "~/utils/spin-delay";

export const loader = async ({ params }: DataFunctionArgs) => {
  invariant(params.id, "Missing collection id");
  invariant(params.fieldId, "Missing field id");

  const field = await prisma.field.findUnique({
    where: { id: params.fieldId },
  });

  if (!field) return redirect(`/admin/settings/data-model/${params.id}`);

  return json({ field });
};

export const action = async ({ request, params }: DataFunctionArgs) => {
  invariant(
    params.id,
    "A collection id is required to update a collection's fields"
  );

  const formData = await request.formData();
  const title = formData.get("title");
  const type = formData.get("fieldType");
  const sortOrder = formData.get("sortOrder");
  const description = formData.get("description");
  const isRequired = formData.get("required");

  const schema = z.object({
    title: z.string().min(1),
    type: z.string().min(1),
    description: z.string().nullable(),
    sortOrder: z.number(),
    isRequired: z.boolean(),
  });

  try {
    const validFieldData = schema.parse({
      title,
      type,
      description,
      sortOrder: Number(sortOrder),
      isRequired: isRequired === "on",
    });

    await prisma.field.update({
      where: { id: params.fieldId },
      data: validFieldData,
    });

    return redirect(`/admin/settings/data-model/${params.id}`);
  } catch (error) {
    console.error(error);
    throw json({ error }, { status: 400 });
  }
};

export default function EditFieldRoute() {
  const navigation = useNavigation();
  const params = useParams();
  const { field } = useLoaderData<typeof loader>();

  if (!field) return null;

  const isUpdatingField = useSpinDelay(navigation.state === "submitting");

  return (
    <Sheet open={true}>
      <SheetContent position="right" size="lg">
        <SheetHeader>
          <SheetTitle>Edit Field ({field.title})</SheetTitle>
          <Separator />
        </SheetHeader>
        <Link
          to={`/admin/settings/data-model/${params.id}`}
          className="absolute -left-12 top-5 bg-foreground/20 p-2 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary"
        >
          <X className="h-5 w-5" />
          <span className="sr-only">Close</span>
        </Link>
        {field.type ? (
          <div className="border border-foreground/20 p-4 mb-4">
            <Form replace method="post">
              <input type="hidden" name="fieldType" value={field.type} />
              <input type="hidden" name="sortOrder" value={field.sortOrder} />
              <div className="grid grid-cols-2 gap-4 pb-8">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-right">
                    Title
                  </Label>
                  <Input
                    id="title"
                    name="title"
                    className="col-span-3"
                    required
                    defaultValue={field.title}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-right">
                    Description
                  </Label>
                  <Input
                    id="description"
                    name="description"
                    className="col-span-3"
                    placeholder="A helpful description for content editors"
                    defaultValue={field.description ?? ""}
                  />
                </div>
                <div className="col-span-2 flex items-center space-x-2">
                  <Checkbox
                    id="required"
                    name="required"
                    defaultValue={field.isRequired ? "on" : "off"}
                  />
                  <label
                    htmlFor="required"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Require value to be set on creation
                  </label>
                </div>
                <Separator className="col-span-2" />
                {/* Dynamic field options based on fieldType */}
                {field.type === "text" ? (
                  <div className="col-span-2 space-y-2">
                    <Label htmlFor="placeholder" className="text-right">
                      Placeholder
                    </Label>
                    <Input
                      id="placeholder"
                      name="placeholder"
                      className="col-span-3"
                    />
                  </div>
                ) : null}
              </div>
              <SheetFooter className="w-full">
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isUpdatingField}
                >
                  {isUpdatingField ? "Saving..." : "Save Changes"}
                </Button>
              </SheetFooter>
            </Form>
          </div>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
