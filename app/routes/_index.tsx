import type { V2_MetaFunction } from "@remix-run/node";
import Hero from "~/components/hero";
import SearchBar from "~/components/search-bar";

export const meta: V2_MetaFunction = () => {
  return [{ title: "New Remix App" }];
};

export default function Index() {
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
      <div className="my-4">
        <SearchBar />
      </div>
      <Hero />
    </div>
  );
}
