import type { LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { PanelTopIcon, PlusIcon } from "lucide-react";
import invariant from "tiny-invariant";
import { RouteTitle } from "~/components/route-title";
import { Button } from "~/components/ui/button";
import { getContentTypeById } from "~/models/content.server";

export const loader = async ({ params }: LoaderArgs) => {
  invariant(params.id, "Missing content type id");

  const contentType = await getContentTypeById(params.id);

  if (!contentType) return redirect("/admin/content");

  return json({ contentType });
};

export default function ContentTypeRoute() {
  const { contentType } = useLoaderData<typeof loader>();

  return (
    <div>
      <RouteTitle title={contentType.title}>
        <Link to="builder">
          <Button variant="ghost">
            <PanelTopIcon className="w-4 h-4 mr-2" />
            Builder
          </Button>
        </Link>
        <Link to="builder">
          <Button>
            <PlusIcon className="w-4 h-4 mr-2" />
            New Entry
          </Button>
        </Link>
      </RouteTitle>
      <p>Entries list goes here</p>
    </div>
  );
}
