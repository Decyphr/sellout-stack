import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";

export const loader = async ({}: LoaderArgs) => {
  return json({});
};

export const action = async ({}: ActionArgs) => {
  return redirect("");
};

export default function MediaLibraryRoute() {
  return <div>Media</div>;
}
