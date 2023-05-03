import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Link, Outlet } from "@remix-run/react";
import { LayersIcon } from "lucide-react";
import UserAvatar from "~/components/user-avatar";

export const loader = async ({}: LoaderArgs) => {
  return json({});
};

export const action = async ({}: ActionArgs) => {
  return redirect("");
};

export default function DashboardLayout() {
  return (
    <div>
      <div className="lg:ml-72 xl:ml-80">
        {/* Top Navbar */}
        <header className="contents lg:pointer-events-none lg:fixed lg:inset-0 lg:z-40 lg:flex">
          <div className="contents lg:pointer-events-auto lg:block lg:w-64 lg:overflow-y-auto lg:border-r lg:border-zinc-900/10 lg:px-6 lg:pb-8 lg:pt-4 lg:dark:border-white/10">
            <div className="hidden lg:flex">
              <a aria-label="Home" href="/">
                <span className="flex justify-start items-center">
                  <LayersIcon
                    className="h-6 w-6 mr-4 inline-block text-emerald-400"
                    aria-hidden="true"
                  />
                  Content Layer
                </span>
              </a>
            </div>

            <div className="fixed border-b border-zinc-800 inset-x-0 top-0 z-50 flex h-14 items-center justify-between gap-12 px-4 transition sm:px-6 lg:left-64 lg:z-30 lg:px-8 backdrop-blur-sm dark:backdrop-blur bg-white/[var(--bg-opacity-light)] dark:bg-zinc-900/[var(--bg-opacity-dark)]">
              <div className="absolute inset-x-0 top-full h-px transition bg-zinc-900/7.5 dark:bg-white/7.5"></div>
              <div className="hidden lg:block lg:max-w-md lg:flex-auto">
                <button
                  type="button"
                  className="hidden h-8 w-full items-center gap-2 rounded-full bg-white pl-2 pr-3 text-sm text-zinc-500 ring-1 ring-zinc-900/10 transition hover:ring-zinc-900/20 dark:bg-white/5 dark:text-zinc-400 dark:ring-inset dark:ring-white/10 dark:hover:ring-white/20 lg:flex focus:[&amp;:not(:focus-visible)]:outline-none"
                >
                  <svg
                    viewBox="0 0 20 20"
                    fill="none"
                    aria-hidden="true"
                    className="h-5 w-5 stroke-current"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12.01 12a4.25 4.25 0 1 0-6.02-6 4.25 4.25 0 0 0 6.02 6Zm0 0 3.24 3.25"
                    ></path>
                  </svg>
                  Find something...
                  <kbd className="ml-auto text-2xs text-zinc-400 dark:text-zinc-500">
                    <kbd className="font-sans">⌘</kbd>
                    <kbd className="font-sans">K</kbd>
                  </kbd>
                </button>
              </div>
              <div className="flex items-center gap-5 lg:hidden">
                <a aria-label="Home" href="/">
                  <span className="flex justify-start items-center">
                    <LayersIcon
                      className="h-6 w-6 mr-4 inline-block text-emerald-400"
                      aria-hidden="true"
                    />
                    Content Layer
                  </span>
                </a>
              </div>
              <div className="flex items-center gap-5">
                <nav className="hidden md:block">
                  <ul role="list" className="flex items-center gap-8">
                    {/* Any auxiliary nav links can go here for desktop */}
                  </ul>
                </nav>
                <div className="hidden md:block md:h-5 md:w-px md:bg-zinc-900/10 md:dark:bg-white/15"></div>
                <div className="flex gap-4">
                  <div className="contents lg:hidden">
                    <button
                      type="button"
                      className="flex h-6 w-6 items-center justify-center rounded-md transition hover:bg-zinc-900/5 dark:hover:bg-white/5 lg:hidden focus:[&amp;:not(:focus-visible)]:outline-none"
                      aria-label="Find something..."
                    >
                      <svg
                        viewBox="0 0 20 20"
                        fill="none"
                        aria-hidden="true"
                        className="h-5 w-5 stroke-zinc-900 dark:stroke-white"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12.01 12a4.25 4.25 0 1 0-6.02-6 4.25 4.25 0 0 0 6.02 6Zm0 0 3.24 3.25"
                        ></path>
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="hidden min-[416px]:contents">
                  <Link to="account">
                    <UserAvatar />
                  </Link>
                </div>
              </div>
            </div>
            <nav className="hidden lg:mt-10 lg:block">
              <ul role="list">
                {/* Any Auxiliary Nav Links can go here for mobile */}
                <li className="relative mt-6 md:mt-0">
                  <h2 className="font-light text-zinc-900 dark:text-white">
                    Content
                  </h2>
                  <div className="relative mt-3 pl-2">
                    <ul role="list">
                      <li className="relative border-l border-emerald-500">
                        <a
                          aria-current="page"
                          className="flex justify-between gap-2 py-1 pr-3 text-sm transition pl-4 text-zinc-900 dark:text-white"
                          href="/"
                        >
                          <span className="truncate">Articles</span>
                        </a>
                      </li>
                      <li className="relative">
                        <a
                          className="flex justify-between gap-2 py-1 pr-3 text-sm transition pl-4 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
                          href="/quickstart"
                        >
                          <span className="truncate">Pages</span>
                        </a>
                      </li>
                    </ul>
                  </div>
                </li>
                <li className="relative mt-6">
                  <Link
                    to="users"
                    className="font-light text-zinc-900 dark:text-white"
                  >
                    Users
                  </Link>
                </li>
                <li className="relative mt-6">
                  <Link
                    to="settings"
                    className="font-light text-zinc-900 dark:text-white"
                  >
                    Settings
                  </Link>
                </li>
                <li className="sticky bottom-0 z-10 mt-6 min-[416px]:hidden">
                  <a
                    className="inline-flex gap-0.5 justify-center overflow-hidden text-sm font-medium transition rounded-full bg-zinc-900 py-1 px-3 text-white hover:bg-zinc-700 dark:bg-emerald-500 dark:text-white dark:hover:bg-emerald-400 w-full"
                    href="/#"
                  >
                    <UserAvatar /> Account
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </header>

        <div className="h-screen flex relative px-4 pt-14 sm:px-6 lg:px-8">
          <main className="py-16 flex flex-1">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
