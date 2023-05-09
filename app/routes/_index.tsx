import type { V2_MetaFunction } from "@remix-run/node";
import Hero from "~/components/hero";

export const meta: V2_MetaFunction = () => {
  return [{ title: "New Remix App" }];
};

export default function Index() {
  return (
    <>
      <Hero />
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-zinc-300 rounded-lg h-96">
            Text
          </div>
        </div>
      </div>
    </>
  );
}
