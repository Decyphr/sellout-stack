import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { RouteTitle } from "~/cms/components/route-title";
import { Button } from "~/cms/components/ui/button";
import {
  checkForProjectConfigChanges,
  generateSchema,
} from "~/cms/services/project-config";

export const loader = async ({}: LoaderArgs) => {
  const { existingContentTypes, fileProjectConfig, hasChanges } =
    await checkForProjectConfigChanges();

  return json({
    existingContentTypes,
    fileProjectConfig,
    hasChanges,
  });
};

export const action = async ({}: ActionArgs) => {
  try {
    await generateSchema();
  } catch (error) {
    console.error(error);
    throw json({ message: "Error generating schema." }, { status: 500 });
  }

  return json({});
};

export default function ConfigSettingsRoute() {
  const { existingContentTypes, fileProjectConfig, hasChanges } =
    useLoaderData();

  return (
    <>
      <RouteTitle title="Project Config">
        {hasChanges ? (
          <Form method="post">
            <Button>Update Project Config</Button>
          </Form>
        ) : null}
      </RouteTitle>

      <h2>{hasChanges}</h2>

      <div className="bg-foreground/10 divide-x grid grid-cols-2 gap-8 max-h-[70vh] overflow-y-auto">
        <div className="p-4 divide-y divide-yellow-300">
          <h2>Loaded Config</h2>
          <pre>{JSON.stringify(existingContentTypes, null, 2)}</pre>
        </div>
        <div className="p-4 divide-y divide-yellow-300">
          <h2>File Config</h2>
          <pre>{JSON.stringify(fileProjectConfig, null, 2)}</pre>
        </div>
      </div>
    </>
  );
}
