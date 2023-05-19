import type { DataFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useUser } from "~/utils/user";

export const loader = async ({}: DataFunctionArgs) => {
  return json({});
};

export const action = async ({}: DataFunctionArgs) => {
  return redirect("");
};

export default function UserSettingsRoute() {
  const user = useUser();
  return <pre>{JSON.stringify(user, null, 2)}</pre>;
}
