import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import { getEntryById } from "~/models/content.server";

export const loader = async ({ params }: LoaderArgs) => {
  invariant(params.entryId, "Missing content type id");

  const entry = await getEntryById(params.entryId);

  if (!entry) return redirect("/admin/content");
  return json({ entry });
};

export const action = async ({}: ActionArgs) => {
  return redirect("");
};

export default function EntryEditRoute() {
  const { entry } = useLoaderData<typeof loader>();

  return <div>{entry.id}</div>;
}
