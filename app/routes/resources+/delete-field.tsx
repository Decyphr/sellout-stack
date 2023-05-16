import { DataFunctionArgs, json, redirect } from "@remix-run/node";
import { useFetcher } from "@remix-run/react";
import { prisma } from "~/db.server";
import { requireUserId } from "~/session.server";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@cms/components/ui/alert-dialog";

export const loader = async ({ request }: DataFunctionArgs) => {
  console.log(request.method);

  if (request.method === "GET") return redirect("/");
};

export const action = async ({ request }: DataFunctionArgs) => {
  const userId = await requireUserId(request);
  const formData = await request.formData();

  const fieldId = formData.get("fieldId");

  if (!fieldId || typeof fieldId !== "string") {
    console.error("Missing fieldId");
    throw json({ error: "Missing fieldId" }, { status: 400 });
  }

  const field = await prisma.field.findFirst({
    where: { id: fieldId },
    include: { collection: { select: { id: true } } },
  });

  if (!field) {
    console.error("Field not found");
    throw json({ error: "Field not found" }, { status: 400 });
  }

  try {
    // delete field, and all related field values
    await prisma.field.delete({ where: { id: field.id } });

    // update affected field sort order
    await prisma.field.updateMany({
      where: {
        sortOrder: { gt: field.sortOrder },
      },
      data: {
        sortOrder: { decrement: 1 },
      },
    });

    return redirect(`/admin/settings/data-model/${field.collection.id}`);
  } catch (error) {
    console.error(error);
    throw json({ error }, { status: 400 });
  }
};

export function DeleteField({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  const deleteFieldFetcher = useFetcher<typeof action>();

  const deleteField = () => {
    deleteFieldFetcher.submit(
      { fieldId: id },
      { method: "post", action: "/resources/delete-field" }
    );
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you want to delete this field?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete this
            collection's field.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={deleteField}>
            {deleteFieldFetcher.state === "submitting"
              ? "Deleting..."
              : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
