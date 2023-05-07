import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form } from "@remix-run/react";
import { RouteTitle } from "~/components/route-title";
import { Button } from "~/components/ui/button";

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
      <Form action="/api/generate" method="post">
        <Button type="submit">Generate Schema</Button>
      </Form>
    </div>
  );
}
