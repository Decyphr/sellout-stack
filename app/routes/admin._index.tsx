import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { LayersIcon } from "lucide-react";
import { Button } from "~/components/ui/button";

export const loader = async ({}: LoaderArgs) => {
  return json({});
};

export const action = async ({}: ActionArgs) => {
  return redirect("");
};

export default function AdminIndexRoute() {
  return (
    <div className="flex flex-1 justify-center items-center">
      <div className="text-center">
        <LayersIcon className="w-10 h-10 m-auto mb-4 text-emerald-300" />
        <h2 className="text-2xl font-medium text-white mb-2">
          No content types added yet
        </h2>
        <p className="text-muted dark:text-slate-400 mb-4">
          Click the button below to create your first content type.
        </p>
        <Link to="content/create">
          <Button variant="outline">Create Content Type</Button>
        </Link>
      </div>
    </div>
  );
}
