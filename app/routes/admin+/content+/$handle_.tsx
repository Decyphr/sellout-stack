import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Link, useLoaderData } from "@remix-run/react";
import { type ColumnDef } from "@tanstack/react-table";
import { PlusIcon } from "lucide-react";
import invariant from "tiny-invariant";
import { DataTable } from "~/components/data-table/data-table";
import { RouteTitle } from "~/components/route-title";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { Entry, createEntry } from "~/models/content.server";
import { prisma } from "~/services/db.server";

const columns: ColumnDef<Pick<Entry, "id" | "title" | "slug">>[] = [
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
    accessorKey: "title",
    header: "title",
    cell: ({ row }) => {
      const entry = row.original;

      return (
        <Link to={entry.id} className="text-emerald-500 hover:underline">
          {entry.title}
        </Link>
      );
    },
  },
  {
    accessorKey: "slug",
    header: "slug",
  },
];

export const loader = async ({ params }: LoaderArgs) => {
  invariant(params.handle, "Missing content type id");

  const collection = await prisma.collection.findUnique({
    where: { handle: params.handle },
    include: { entries: true },
  });

  if (!collection) return redirect("/admin/content");

  return json({ collection });
};

export const action = async ({ params }: ActionArgs) => {
  invariant(params.handle, "Missing content type id");

  try {
    const newEntry = await createEntry(params.handle);
    return redirect(`/admin/content/${params.handle}/${newEntry.id}`);
  } catch (error) {
    console.error(error);
    throw json({ message: error }, { status: 400 });
  }
};

export default function CollectionRoute() {
  const { collection } = useLoaderData<typeof loader>();

  return (
    <div>
      <RouteTitle title={collection.title}>
        <Form method="post">
          <Button type="submit">
            <PlusIcon className="w-4 h-4 mr-2" />
            New Entry
          </Button>
        </Form>
      </RouteTitle>
      <DataTable columns={columns} data={collection.entries} />
    </div>
  );
}
