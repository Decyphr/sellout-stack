import { DataFunctionArgs, json, redirect } from "@remix-run/node";

import { useFetcher } from "@remix-run/react";
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
} from "~/components/ui/alert-dialog";
import { Collection } from "~/models/content.server";
import { requireUserId } from "~/services/auth.server";
import { prisma } from "~/services/db.server";

export const loader = async ({ request }: DataFunctionArgs) => {
  if (request.method === "GET") return redirect("/");
};

export const action = async ({ request }: DataFunctionArgs) => {
  const userId = await requireUserId(request);
  if (!userId) return redirect("/");

  const formData = await request.formData();
  const collectionId = formData.get("collectionId");

  // TODO: Add Zod/Conform validation
  if (!collectionId || typeof collectionId !== "string") {
    console.error("Missing fieldId");
    throw json({ error: "Missing fieldId" }, { status: 400 });
  }

  try {
    await prisma.collection.delete({ where: { id: collectionId } });

    return redirect("/admin/settings/data-model");
  } catch (error) {
    console.error(error);
    throw json({ error }, { status: 400 });
  }
};

export default function DeleteCollection({
  id,
  children,
}: {
  id: Collection["id"];
  children: React.ReactNode;
}) {
  const deleteCollectionFetcher = useFetcher<typeof action>();

  function deleteCollection() {
    deleteCollectionFetcher.submit(
      { collectionId: id },
      { method: "post", action: "/resources/delete-collection" }
    );
  }

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
          <AlertDialogAction onClick={deleteCollection}>
            {deleteCollectionFetcher.state === "submitting"
              ? "Deleting..."
              : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
