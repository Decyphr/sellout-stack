import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
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
      <h1>Content</h1>
      <ul>
        {contentTypes.map((contentType) => (
          <li key={contentType.id}>{contentType.title}</li>
        ))}
      </ul>
    </div>
  );
}
