import { RouteTitle } from "@cms/components/route-title";
import { SimpleCard } from "@cms/components/simple-card";
import { Button } from "@cms/components/ui/button";
import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { PlusIcon } from "lucide-react";
import { getAllCollections } from "~/models/content.server";

export const loader = async ({}: LoaderArgs) => {
  const collections = await getAllCollections();

  return json({ collections });
};

export const action = async ({}: ActionArgs) => {
  return redirect("");
};

export default function ContentRoute() {
  const { collections } = useLoaderData<typeof loader>();

  return (
    <div>
      <RouteTitle title="Content">
        <Button>
          <PlusIcon className="w-4 h-4 mr-2" /> New Entry
        </Button>
      </RouteTitle>
      <div className="grid gap-4 md:gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {collections.map((collection) => (
          <SimpleCard
            key={collection.id}
            title={collection.title}
            link={collection.id}
          />
        ))}
      </div>
    </div>
  );
}
