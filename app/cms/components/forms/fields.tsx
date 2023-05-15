import { Input } from "@cms/components/ui/input";
import { Label } from "@cms/components/ui/label";
import { Switch } from "@cms/components/ui/switch";
import { Field, FieldValue } from "~/models/content.server";

type DynamicFieldProps = {
  field: Pick<
    Field,
    "title" | "handle" | "type" | "isRequired" | "description"
  >;
  values: Pick<FieldValue, "id" | "textValue">;
};

export function DynamicField({ field, values }: DynamicFieldProps) {
  return (
    <>
      {field.type === "text" ? (
        <div className="space-y-2">
          <Label htmlFor={field.handle} className="text-right">
            {field.title}
          </Label>
          <Input
            id={field.handle}
            name={field.handle}
            className="col-span-3"
            required
            defaultValue={values.textValue ?? ""}
          />
        </div>
      ) : field.type === "boolean" ? (
        <div className="flex flex-col space-y-2">
          <Label htmlFor={field.handle}>{field.title}</Label>
          <Switch id={field.handle} name={field.handle} />
        </div>
      ) : (
        <div className="text-red-500">
          "{field.type}" Field Type Not Implemented Yet!
        </div>
      )}
    </>
  );
}
