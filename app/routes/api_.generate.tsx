import { LoaderArgs, json, redirect } from "@remix-run/node";
import { generateSchema } from "~/cms/cms.config";

export const loader = async ({}: LoaderArgs) => {
  return json({});
};

export const action = async () => {
  try {
    await generateSchema();
  } catch (error) {
    console.error(error);
  }
  return redirect("/admin/settings");
};
