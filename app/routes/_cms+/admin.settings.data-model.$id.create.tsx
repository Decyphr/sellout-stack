import type { ActionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import {
  Form,
  Link,
  useNavigation,
  useRouteLoaderData,
} from "@remix-run/react";
import { AlignLeft, ToggleLeft, X } from "lucide-react";
import { useState } from "react";
import invariant from "tiny-invariant";
import { z } from "zod";
import { Button } from "~/cms/components/ui/button";
import { Checkbox } from "~/cms/components/ui/checkbox";
import { Input } from "~/cms/components/ui/input";
import { Label } from "~/cms/components/ui/label";
import { Separator } from "~/cms/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "~/cms/components/ui/sheet";
import { cn } from "~/cms/lib/utils/cn";
import { Collection, Field, createField } from "~/models/content.server";

export const action = async ({ request, params }: ActionArgs) => {
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

    await createField({ ...validFieldData }, params.id);

    return redirect(`/admin/settings/data-model/${params.id}`);
  } catch (error) {
    console.error(error);
    throw json({ error }, { status: 400 });
  }
};

export default function CreateFieldRoute() {
  const navigation = useNavigation();
  const { collection, fields } = useRouteLoaderData(
    "routes/_cms+/admin.settings.data-model.$id"
  ) as { collection: Collection; fields: Field[] };

  if (!collection || !fields) return null;

  const newFieldSortOrder = fields?.length ?? 0;

  const fieldTypes = ["text", "textarea", "number", "boolean", "date"];
  const [fieldType, setFieldType] = useState("");

  const fieldTypeClasses =
    "flex-1 p-4 md:p-8 bg-foreground/10 border transition-colors hover:bg-foreground/20 text-center";

  const activeFieldTypeClasses =
    "bg-foreground/20 border-emerald-500 text-emerald-500";

  const toggleFieldType = (newFieldType: string) => {
    if (newFieldType === fieldType || !fieldTypes.includes(newFieldType)) {
      setFieldType("");
      return;
    }

    setFieldType(newFieldType);
  };

  const isCreatingField = navigation.state === "submitting";

  return (
    <Sheet open={true}>
      <SheetContent position="right" size="lg">
        <SheetHeader>
          <SheetTitle>New Field ({collection.title})</SheetTitle>
          <Separator />
        </SheetHeader>
        <Link
          to={`/admin/settings/data-model/${collection.id}`}
          className="absolute -left-12 top-5 bg-foreground/20 p-2 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary"
        >
          <X className="h-5 w-5" />
          <span className="sr-only">Close</span>
        </Link>

        <div className="my-4 grid gap-4 md:my-8 md:gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          <button
            onClick={() => toggleFieldType("text")}
            className={cn(
              fieldTypeClasses,
              fieldType === "text" && activeFieldTypeClasses
            )}
          >
            <AlignLeft className="w-5 h-5 mx-auto mb-2" />
            Text
          </button>
          <button
            onClick={() => toggleFieldType("boolean")}
            className={cn(
              fieldTypeClasses,
              fieldType === "boolean" && activeFieldTypeClasses
            )}
          >
            <ToggleLeft className="w-5 h-5 mx-auto mb-2" />
            Toggle
          </button>
        </div>
        {fieldType ? (
          <div className="border border-foreground/20 p-4 mb-4">
            <Form replace method="post">
              <input type="hidden" name="fieldType" value={fieldType} />
              <input type="hidden" name="sortOrder" value={newFieldSortOrder} />
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
                  />
                </div>
                <div className="col-span-2 flex items-center space-x-2">
                  <Checkbox id="required" name="required" />
                  <label
                    htmlFor="required"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Require value to be set on creation
                  </label>
                </div>
                <Separator className="col-span-2" />
                {/* Dynamic field options based on fieldType */}
                {fieldType === "text" ? (
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
                  disabled={isCreatingField}
                >
                  {isCreatingField ? "Creating..." : "Create Field"}
                </Button>
              </SheetFooter>
            </Form>
          </div>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
