import { User } from "@prisma/client";
import type { DataFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "~/components/data-table/data-table";

import { Checkbox } from "~/components/ui/checkbox";

import { ArrowUpDown, Plus } from "lucide-react";
import { RouteTitle } from "~/components/route-title";
import { Button } from "~/components/ui/button";
import { prisma } from "~/services/db.server";

// user data for table

const columns: ColumnDef<Pick<User, "id" | "email" | "username" | "name">>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "username",
    header: "Username",
    cell: ({ row }) => {
      const user = row.original;

      return (
        <Link to={user.id} className="text-emerald-500 hover:underline">
          {user.username}
        </Link>
      );
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="text-muted-foreground"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "name",
    header: "Full Name",
  },
];

export const loader = async ({}: DataFunctionArgs) => {
  const users = await prisma.user.findMany({
    select: { id: true, email: true, username: true, name: true },
  });

  return json({ users: users ?? [] });
};

export const action = async ({}: DataFunctionArgs) => {
  return redirect("");
};

export default function UsersRoute() {
  const { users } = useLoaderData<typeof loader>();

  if (!users) {
    return (
      <div>
        No Users!
        <Link to="/users/new">Create New User</Link>
      </div>
    );
  }

  return (
    <div>
      <RouteTitle title="Users">
        <Button>
          <Plus className="w-4 h-4 mr-2" /> Create User
        </Button>
      </RouteTitle>
      <DataTable columns={columns} data={users} searchColumn="email" />
    </div>
  );
}
