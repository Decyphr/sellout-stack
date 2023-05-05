import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import DataTable from "~/components/data-list";

export const loader = async ({}: LoaderArgs) => {
  return json({});
};

export const action = async ({}: ActionArgs) => {
  return redirect("");
};

export default function UserRoute() {
  const data = [
    {
      name: "John Doe",
      age: 25,
      email: "john@test.com",
    },
    {
      name: "Jane Doe",
      age: 24,
      email: "jane@test.com",
    },
    {
      name: "John Smith",
      age: 30,
      email: "jsmith@test.com",
    },
  ];

  return <DataTable data={data} />;
}
