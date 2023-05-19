import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { LayersIcon } from "lucide-react";

export const loader = async ({}: LoaderArgs) => {
  return json({});
};

export const action = async ({}: ActionArgs) => {
  return redirect("");
};

export default function DasboardRoute() {
  return (
    <div className="flex flex-1 justify-center items-center">
      <div className="text-center">
        <LayersIcon className="w-10 h-10 m-auto mb-4 text-emerald-400" />
        <h2 className="text-2xl text-white mb-2">
          No content types added yet!
        </h2>
        <p className="text-muted dark:text-slate-400 mb-4">
          Edit the <code className="text-orange-400">schema</code> file to add
          content types.
        </p>
      </div>
    </div>
  );
}
