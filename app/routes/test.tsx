import type { DataFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { forge } from "~/services/forge";

export const loader = async ({}: DataFunctionArgs) => {
  const content = await forge.collection("pages");

  if (!content) throw json({ status: 404 });

  return json({ content });
};

export const action = async ({}: DataFunctionArgs) => {
  return redirect("");
};

export default function TestRoute() {
  const { content } = useLoaderData<typeof loader>();

  return (
    <div className="py-16 max-w-7xl mx-auto">
      <h1>Forge Client:</h1>
      <div className="mt-8 bg-foreground/10 p-4 rounded-md">
        <pre>{JSON.stringify(content, null, 2)}</pre>
      </div>
    </div>
  );
}
