import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Switch } from "~/components/ui/switch";
import type { Field, FieldValue } from "~/models/content.server";

/*
 * Handle Errors from Conform like a boss
 */

export type ListOfErrors = Array<string | null | undefined> | null | undefined;

export function ErrorList({
  id,
  errors,
}: {
  errors?: ListOfErrors;
  id?: string;
}) {
  const errorsToRender = errors?.filter(Boolean);
  if (!errorsToRender?.length) return null;
  return (
    <ul id={id} className="bg-red-500/20 p-2 mt-2 mb-4 rounded-sm space-y-1">
      {errorsToRender.map((err) => (
        <li key={err} className="text-xs text-red-500">
          <em>{err}</em>
        </li>
      ))}
    </ul>
  );
}

/*
 * Text Input Field
 */

type FieldProps = {
  id: string; // used as the id and name of the input
  label: string;
  required?: boolean;
  type?: "text" | "email" | "password" | "number" | "tel" | "url";
  defaultValue?: string;
  errors?: ListOfErrors;
};

export function Field({
  id,
  label,
  required = false,
  defaultValue,
  errors,
  type = "text",
}: FieldProps) {
  const errorId = errors?.length ? `${id}-error` : undefined;

  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-right">
        {label}
        {required ? <sup className="text-red-500 text-xs">*</sup> : null}
      </Label>
      <Input
        id={id}
        name={id}
        aria-describedby={errorId}
        aria-invalid={errorId ? true : undefined}
        defaultValue={defaultValue ?? ""}
        required={required}
        type={type}
      />
      <div>{errorId ? <ErrorList id={errorId} errors={errors} /> : null}</div>
    </div>
  );
}

/*
 * Render dynamic fields for an entry
 */

type DynamicFieldProps = {
  field: Pick<Field, "title" | "type" | "isRequired">;
  value: Pick<FieldValue, "id" | "textValue" | "booleanValue">;
  errors?: ListOfErrors;
};

export function DynamicFieldRenderer({
  field,
  value,
  errors,
}: DynamicFieldProps) {
  const errorId = errors?.length ? `${value.id}-error` : undefined;

  return (
    <>
      {field.type === "text" ? (
        <Field
          id="username"
          label="Username"
          errors={errors}
          defaultValue={value.textValue ?? ""}
          required={field.isRequired ?? false}
        />
      ) : field.type === "boolean" ? (
        <div>
          <div className="flex flex-col space-y-2">
            <Label htmlFor="airplane-mode">{field.title}</Label>
            <Switch
              id="airplane-mode"
              defaultChecked={value.booleanValue ?? false}
            />
          </div>
          <div>
            {errorId ? <ErrorList id={errorId} errors={errors} /> : null}
          </div>
        </div>
      ) : null}
    </>
  );
}
