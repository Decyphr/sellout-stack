import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Link, useLoaderData } from "@remix-run/react";
import { PlusIcon } from "lucide-react";
import invariant from "tiny-invariant";
import { RouteTitle } from "~/components/route-title";
import { Button } from "~/components/ui/button";
import { createEntry, getCollectionById } from "~/models/content.server";

export const loader = async ({ params }: LoaderArgs) => {
  invariant(params.id, "Missing content type id");

  const collection = await getCollectionById(params.id);

  if (!collection) return redirect("/admin/content");

  return json({ collection });
};

export const action = async ({ params }: ActionArgs) => {
  invariant(params.id, "Missing content type id");

  try {
    const newEntry = await createEntry(params.id);
    return redirect(`/admin/content/${params.id}/${newEntry.id}`);
  } catch (error) {
    console.error(error);
    throw json({ message: error }, { status: 400 });
  }
};

export default function CollectionRoute() {
  const { collection } = useLoaderData<typeof loader>();

  return (
    <div>
      <RouteTitle title={collection.title}>
        <Form method="post">
          <Button type="submit">
            <PlusIcon className="w-4 h-4 mr-2" />
            New Entry
          </Button>
        </Form>
      </RouteTitle>
      <ul>
        {collection.entries.map((entry) => (
          <li key={entry.id}>
            <Link to={entry.id}>{entry.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
