import { ActionArgs, LoaderArgs, json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { makeDomainFunction } from "domain-functions";
import {
  EditIcon,
  ItalicIcon,
  TextIcon,
  ToggleLeftIcon,
  XIcon,
} from "lucide-react";
import { useState } from "react";
import { performMutation } from "remix-forms";
import invariant from "tiny-invariant";
import { FieldEditor } from "~/components/field-editor";
import { RouteTitle } from "~/components/route-title";
import { Button } from "~/components/ui/button";
import { toCamelCase } from "~/lib/utils/formatters";
import { createFieldSchema } from "~/lib/validators/contentSchemas";
import {
  FIELD_TYPES,
  createField,
  getContentTypeById,
  getFieldsByContentTypeId,
} from "~/models/content.server";

export const loader = async ({ params }: LoaderArgs) => {
  invariant(params.id, "Missing content type id");

  const contentType = await getContentTypeById(params.id);
  const fields = await getFieldsByContentTypeId(params.id);

  if (!contentType) return redirect("/admin/content");

  return json({ contentType, fields, fieldTypes: FIELD_TYPES });
};

export const action = async ({ request, params }: ActionArgs) => {
  const formData = await request.clone().formData();
  const _action = formData.get("_action");
  invariant(_action, "Missing _action field");

  if (_action === "createField") {
    const result = await performMutation({
      request,
      schema: createFieldSchema,
      mutation: makeDomainFunction(createFieldSchema)(async (values) => {
        const fieldObject = {
          type: values.type,
          title: values.title,
          handle: toCamelCase(values.title),
          sortOrder: parseInt(values.sortOrder, 10),
        };

        invariant(params.id, "Missing content type id");

        const field = await createField(params.id, fieldObject);

        if (!field) throw "Unable to create field!";

        return values;
      }),
    });

    if (!result.success) {
      return json(result, { status: 400 });
    }
  }

  return json({});
};

export default function ContentTypeBuilderRoute() {
  const { contentType, fields, fieldTypes } = useLoaderData<typeof loader>();

  // identify the max sort order
  const max = !fields.length
    ? 0
    : Math.max(...fields.map((field) => field.sortOrder));

  const [sortOrder, setSortOrder] = useState(max + 1);

  return (
    <>
      <RouteTitle title={`${contentType.title} Structure Builder`} />
      <div className="flex">
        <div className="flex flex-1 gap-8">
          {/* Field Layout */}
          <div className="flex-1 space-y-4">
            <h2 className="text-xl font-semibold mb-4">Structure Blueprint</h2>
            <div className="space-y-4">
              {fields.map((field, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center bg-foreground/10 p-4 text-primary"
                >
                  {field.title}
                  <div className="space-x-2">
                    <Button variant="ghost" size="sm">
                      <EditIcon className="w-4 h-4" />
                    </Button>
                    <Button
                      type="submit"
                      variant="destructive"
                      size="sm"
                      name="_action"
                      value="deleteField"
                    >
                      <input type="hidden" className="hidden" />
                      <XIcon className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <FieldEditor
              contentTypeId={contentType.id}
              sortOrder={sortOrder + 1}
              title="Create New Field"
              description="Select a field type to begin creating your field."
              triggerText="Add Field"
              fieldTypes={fieldTypes}
            />
          </div>
          {/* This is the sidebar */}
          <div className="w-72 text-primary">
            <h2 className="text-xl font-semibold mb-4">Content Settings</h2>
            <div className="bg-foreground/10 p-4">
              <ul className="space-y-4">
                <li className="p-2 bg-emerald-900 border-l-4 border-emerald-500">
                  <span className="flex items-center">
                    <TextIcon className="w-4 h-4 mr-2" />
                    Text
                  </span>
                </li>
                <li className="p-2 bg-purple-900 border-l-4 border-purple-500">
                  <span className="flex items-center">
                    <ItalicIcon className="w-4 h-4 mr-2" />
                    Rich Text
                  </span>
                </li>
                <li className="p-2 bg-blue-900 border-l-4 border-blue-500">
                  <span className="flex items-center">
                    <ToggleLeftIcon className="w-4 h-4 mr-2" />
                    Boolean
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
