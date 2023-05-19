import { redirect, type DataFunctionArgs } from "@remix-run/node";
import { authenticator } from "~/services/auth.server";

export async function action({ request }: DataFunctionArgs) {
  await authenticator.logout(request, { redirectTo: "/login" });
}

export async function loader() {
  return redirect("/login");
}
