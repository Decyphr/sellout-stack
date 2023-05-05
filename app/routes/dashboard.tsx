import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Link, Outlet } from "@remix-run/react";
import {
  FilesIcon,
  ImageIcon,
  LayersIcon,
  SettingsIcon,
  UsersIcon,
} from "lucide-react";
import UserAvatar from "~/components/user-avatar";
import { requireUser } from "~/session.server";

export const loader = async ({ request }: LoaderArgs) => {
  const user = await requireUser(request);
  if (!user) return redirect("/login");
  return json({ user });
};

export const action = async ({}: ActionArgs) => {
  return redirect("");
};

export default function DashboardLayout() {
  return (
    <div>
      {/* TODO: Refactor */}
      <div className="lg:ml-64">
        {/* Top Navbar */}
        <header className="contents lg:pointer-events-none lg:fixed lg:inset-0 lg:z-40 lg:flex">
          <div className="contents lg:pointer-events-auto lg:block lg:w-64 lg:overflow-y-auto lg:border-r lg:border-zinc-900/10 lg:px-6 lg:pb-8 lg:pt-4 lg:dark:border-white/10">
            <div className="hidden lg:flex">
              <Link aria-label="Home" to="/dashboard">
                <span className="flex justify-start items-center">
                  <LayersIcon
                    className="h-6 w-6 mr-4 inline-block text-emerald-400"
                    aria-hidden="true"
                  />
                  ForgeCMS
                </span>
              </Link>
            </div>

            <div className="fixed border-b border-zinc-800 inset-x-0 top-0 z-50 flex h-14 items-center justify-between gap-12 px-4 transition sm:px-6 lg:left-64 lg:z-30 lg:px-8 backdrop-blur-sm dark:backdrop-blur bg-white/[var(--bg-opacity-light)] dark:bg-zinc-900/[var(--bg-opacity-dark)]">
              <div className="absolute inset-x-0 top-full h-px transition bg-zinc-900/7.5 dark:bg-white/7.5"></div>
              <div className="hidden lg:block lg:max-w-md lg:flex-auto">
                <button
                  type="button"
                  className="hidden h-8 w-full items-center gap-2 bg-white pl-2 pr-3 text-sm text-zinc-500 ring-1 ring-zinc-900/10 transition hover:ring-zinc-900/20 dark:bg-white/5 dark:text-zinc-400 dark:ring-inset dark:ring-white/10 dark:hover:ring-white/20 lg:flex focus:[&amp;:not(:focus-visible)]:outline-none"
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
                    ForgeCMS
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
                <li className="relative mt-3 md:mt-0 flex">
                  <Link
                    to="content"
                    className="flex-1 font-light text-zinc-900 dark:text-white dark:hover:bg-zinc-800 rounded-sm p-2"
                  >
                    <span className="flex justify-start items-center">
                      <FilesIcon className="w-5 h-5 text-emerald-400 mr-2" />
                      Content
                    </span>
                  </Link>
                </li>
                <li className="relative mt-3 flex">
                  <Link
                    to="media"
                    className="flex-1 font-light text-zinc-900 dark:text-white dark:hover:bg-zinc-800 rounded-sm p-2"
                  >
                    <span className="flex justify-start items-center">
                      <ImageIcon className="w-5 h-5 text-emerald-400 mr-2" />
                      Media
                    </span>
                  </Link>
                </li>
                <li className="relative mt-3 flex">
                  <Link
                    to="users"
                    className="flex-1 font-light text-zinc-900 dark:text-white dark:hover:bg-zinc-800 rounded-sm p-2"
                  >
                    <span className="flex justify-start items-center">
                      <UsersIcon className="w-5 h-5 text-emerald-400 mr-2" />
                      Users
                    </span>
                  </Link>
                </li>
                <li className="relative mt-3 flex">
                  <Link
                    to="settings"
                    className="flex-1 font-light text-zinc-900 dark:text-white dark:hover:bg-zinc-800 rounded-sm p-2"
                  >
                    <span className="flex justify-start items-center">
                      <SettingsIcon className="w-5 h-5 text-emerald-500 mr-2" />
                      Settings
                    </span>
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

        <div className="h-screen relative px-4 pt-14 sm:px-6 lg:px-8">
          <main className="py-4 sm:py-6 lg:py-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
