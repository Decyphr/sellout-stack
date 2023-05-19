import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { RouteTitle } from "~/components/route-title";
import { SimpleCard } from "~/components/simple-card";

export const loader = async ({}: LoaderArgs) => {
  return json({});
};

export const action = async ({}: ActionArgs) => {
  return redirect("");
};

export default function SettingsRoute() {
  return (
    <div>
      <RouteTitle title="Settings" />

      <div className="grid gap-4 md:gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        <SimpleCard title="Data Model" link="data-model" />
      </div>
    </div>
  );
}
