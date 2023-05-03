import { Outlet } from "@remix-run/react";
import Menu from "~/components/navs/menu";

export default function AdminLayout() {
  return (
    <div className="flex flex-col h-screen">
      <div>
        <h1>Remix Content Layer</h1>
      </div>
      <header className="fixed top-0 left-0 right-0">
        <Menu />
      </header>
      <main className="flex flex-1 pt-10">
        <div className="flex flex-1 p-4 md:p-12">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
