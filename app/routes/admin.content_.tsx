import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { PlusIcon } from "lucide-react";
import { RouteTitle } from "~/components/route-title";
import { SimpleCard } from "~/components/simple-card";
import { Button } from "~/components/ui/button";
import { getAllContentTypes } from "~/models/content.server";

export const loader = async ({}: LoaderArgs) => {
  const contentTypes = await getAllContentTypes();

  return json({ contentTypes });
};

export const action = async ({}: ActionArgs) => {
  return redirect("");
};

export default function ContentRoute() {
  const { contentTypes } = useLoaderData<typeof loader>();

  return (
    <div>
      <RouteTitle title="Content">
        <Link to="create">
          <Button>
            <PlusIcon className="w-4 h-4 mr-2" /> New Content Type
          </Button>
        </Link>
      </RouteTitle>
      <div className="grid gap-4 md:gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {contentTypes.map((contentType) => (
          <SimpleCard
            key={contentType.id}
            title={contentType.title}
            link={contentType.id}
          />
        ))}
      </div>
    </div>
  );
}
