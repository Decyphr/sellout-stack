import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Form } from "~/form";
import { createFieldSchema } from "~/lib/validators/contentSchemas";

interface FieldEditorProps {
  contentTypeId: string;
  sortOrder: number;
  title: string;
  description?: string;
  triggerText: string;
  fieldTypes: string[];
}

const FieldEditor: React.FC<FieldEditorProps> = ({
  contentTypeId,
  sortOrder,
  title,
  description,
  triggerText,
  fieldTypes,
}: FieldEditorProps) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="lg" className="w-full">
          {triggerText}
        </Button>
      </SheetTrigger>
      <SheetContent position="right" size="lg">
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription>{description}</SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <Form
            schema={createFieldSchema}
            hiddenFields={["_action", "contentTypeId", "sortOrder"]}
            values={{
              _action: "createField",
              contentTypeId,
              sortOrder,
            }}
          >
            {({ Field, Errors, register, setValue }) => (
              <>
                <Field
                  name="_action"
                  type="hidden"
                  className="hidden"
                  defaultValue="createField"
                />
                <Field
                  name="contentTypeId"
                  type="hidden"
                  className="hidden"
                  defaultValue={contentTypeId}
                />
                <Field
                  name="sortOrder"
                  type="hidden"
                  className="hidden"
                  defaultValue={sortOrder}
                />
                <Field name="type">
                  {({ Errors }) => (
                    <>
                      <Label>Field Type</Label>
                      <Select
                        onValueChange={(value: string) =>
                          setValue("type", value, { shouldValidate: true })
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Field Type" />
                        </SelectTrigger>
                        <SelectContent>
                          {fieldTypes.map((type, idx) => (
                            <SelectItem
                              key={idx}
                              value={type}
                              className="capitalize"
                            >
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Errors />
                    </>
                  )}
                </Field>
                <Field name="title">
                  {({ Errors }) => (
                    <>
                      <Label htmlFor="title" className="text-right">
                        Title
                      </Label>
                      <Input {...register("title")} />
                    </>
                  )}
                </Field>
                <Button type="submit" name="_action" value="create-field">
                  Create Field
                </Button>
                <Errors />
              </>
            )}
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export { FieldEditor };
