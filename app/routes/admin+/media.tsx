import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { RouteTitle } from "~/components/route-title";

export const loader = async ({}: LoaderArgs) => {
  return json({});
};

export const action = async ({}: ActionArgs) => {
  return redirect("");
};

export default function MediaLibraryRoute() {
  return (
    <div>
      <RouteTitle title="Media Library" />
    </div>
  );
}
