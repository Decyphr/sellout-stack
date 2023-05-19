import type { V2_MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { Button } from "~/components/ui/button";

export const meta: V2_MetaFunction = () => {
  return [{ title: "New Remix App" }];
};

export default function Index() {
  return (
    <div className="h-screen w-full flex flex-col justify-center items-center gap-4">
      <h1>Homepage</h1>
      <div className="flex gap-4">
        <Link to="admin">
          <Button>Admin</Button>
        </Link>
        <Link to="test">
          <Button>Test Something</Button>
        </Link>
      </div>
    </div>
  );
}
