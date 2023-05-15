import type { DataFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { deleteFields } from "~/models/content.server";

export const action = async ({ request }: DataFunctionArgs) => {
  const formData = await request.formData();
  const fieldId = formData.get("fieldId");

  console.log("Hit resource route...");

  if (!fieldId || typeof fieldId !== "string") {
    console.error("Missing fieldId");
    throw json({ error: "Missing fieldId" }, { status: 400 });
  }

  try {
    // delete field, and all related field values
    await deleteFields([fieldId]);
    return json({ success: true });
  } catch (error) {
    console.error(error);
    throw json({ error }, { status: 400 });
  }
};

export function DeleteField({ id }: { id: string }) {}
