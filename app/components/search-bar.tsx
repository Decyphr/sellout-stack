import { SearchIcon } from "lucide-react";

const SearchBar = () => {
  // use Tailwind CSS to style the search bar

  return (
    <div className="flex justify-center">
      <div className="relative text-gray-600 focus-within:text-gray-400">
        <span className="absolute inset-y-0 left-0 flex items-center pl-2">
          <SearchIcon className="w-5 h-5 text-gray-400" />
        </span>
        <form action="/search" method="get" className="py-2">
          <input
            type="search"
            name="q"
            className="py-2 text-sm text-white bg-gray-900 rounded-md pl-10 focus:outline-none focus:bg-white focus:text-gray-900"
            placeholder="Search..."
            autoComplete="off"
          />
        </form>
      </div>
    </div>
  );
};

export default SearchBar;
