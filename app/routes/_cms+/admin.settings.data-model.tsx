import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { Plus } from "lucide-react";
import { RouteTitle } from "~/cms/components/route-title";
import { SimpleCard } from "~/cms/components/simple-card";
import { Button } from "~/cms/components/ui/button";
import { getAllCollections, type Collection } from "~/models/content.server";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@cms/components/ui/sheet";
import { Input } from "~/cms/components/ui/input";
import { Label } from "~/cms/components/ui/label";

export const loader = async ({}: LoaderArgs) => {
  const collections = await getAllCollections();

  return json({ collections });
};

export const action = async ({ request }: ActionArgs) => {
  const formData = await request.formData();
  const title = formData.get("title");

  console.log({ title });

  // const newCollection = await createCollection();
  return redirect("");
};

export default function DataModelSettingsRoute() {
  const { collections } = useLoaderData();

  return (
    <div>
      <RouteTitle title="Data Model">
        <Sheet>
          <SheetTrigger asChild>
            <Button>
              <Plus className="w-5 h-5 mr-2" /> Create Collection
            </Button>
          </SheetTrigger>
          <SheetContent position="right" size="lg">
            <SheetHeader>
              <SheetTitle>Creating New Collection</SheetTitle>
              <SheetDescription>
                Make changes to your profile here. Click save when you're done.
              </SheetDescription>
            </SheetHeader>
            <Form method="post">
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="title" className="text-right">
                    Title
                  </Label>
                  <Input id="title" name="title" className="col-span-3" />
                </div>
              </div>
              <SheetFooter>
                <Button type="submit">Save changes</Button>
              </SheetFooter>
            </Form>
          </SheetContent>
        </Sheet>
      </RouteTitle>
      <div className="grid gap-4 md:gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {collections.map((collection: Collection) => (
          <SimpleCard
            key={collection.id}
            title={collection.title}
            link={collection.id}
          />
        ))}
      </div>
    </div>
  );
}
