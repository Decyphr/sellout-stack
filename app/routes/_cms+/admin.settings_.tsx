import { Button } from "@cms/components/ui/button";
import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { RouteTitle } from "~/cms/components/route-title";

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

      <Link to="config">
        <Button>Go to Project Config</Button>
      </Link>
    </div>
  );
}
