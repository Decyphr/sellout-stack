import { RouteTitle } from "@cms/components/route-title";
import { Button } from "@cms/components/ui/button";
import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Link, useLoaderData } from "@remix-run/react";
import { PlusIcon } from "lucide-react";
import invariant from "tiny-invariant";
import { createEntry, getContentTypeById } from "~/models/content.server";

export const loader = async ({ params }: LoaderArgs) => {
  invariant(params.id, "Missing content type id");

  const contentType = await getContentTypeById(params.id);

  if (!contentType) return redirect("/admin/content");

  return json({ contentType });
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

export default function ContentTypeRoute() {
  const { contentType } = useLoaderData<typeof loader>();

  return (
    <div>
      <RouteTitle title={contentType.title}>
        <Form method="post">
          <Button type="submit">
            <PlusIcon className="w-4 h-4 mr-2" />
            New Entry
          </Button>
        </Form>
      </RouteTitle>
      <ul>
        {contentType.entries.map((entry) => (
          <li key={entry.id}>
            <Link to={entry.id}>{entry.id}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
