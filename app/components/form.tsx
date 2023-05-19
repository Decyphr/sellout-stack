import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
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
    <ul id={id} className="space-y-1">
      {errorsToRender.map((e) => (
        <li key={e} className="text-[10px] text-accent-red">
          {e}
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
      <div className="px-4 pb-3 pt-1">
        {errorId ? <ErrorList id={errorId} errors={errors} /> : null}
      </div>
    </div>
  );
}

/*
 * Render dynamic fields for an entry
 */

type DynamicFieldProps = {
  fields: Array<
    Pick<FieldValue, "id" | "textValue"> & {
      field: Pick<Field, "title" | "type" | "isRequired">;
    }
  >;
};

export function DynamicFieldRenderer({ fields }: DynamicFieldProps) {
  return (
    <>
      {/*  {fields.map((fieldValue) => {
        switch (fieldValue.field.type) {
          case "text":
            return (
              
            );
        }
      })} */}
    </>
  );
}
