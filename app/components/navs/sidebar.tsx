import { Link, NavLink } from "@remix-run/react";
import { FilesIcon, ImageIcon, SettingsIcon, UsersIcon } from "lucide-react";
import UserAvatar from "~/components/user-avatar";
import { cn } from "~/lib/utils/cn";

const linkIconClass = "w-5 h-5 mr-2";

const Sidebar = () => {
  return (
    <nav className="hidden lg:mt-10 lg:block">
      <ul role="list">
        {/* Any Auxiliary Nav Links can go here for mobile */}
        <SideBarLink href={"content"}>
          <FilesIcon className={linkIconClass} />
          Content
        </SideBarLink>
        <SideBarLink href={"media"}>
          <ImageIcon className={linkIconClass} />
          Media
        </SideBarLink>
        <SideBarLink href={"users"}>
          <UsersIcon className={linkIconClass} />
          Users
        </SideBarLink>
        <SideBarLink href={"settings"}>
          <SettingsIcon className={linkIconClass} />
          Settings
        </SideBarLink>
        <li className="sticky bottom-0 z-10 mt-6 min-[416px]:hidden">
          <Link
            to="user/account"
            className="inline-flex gap-0.5 justify-center overflow-hidden text-sm font-medium transition rounded-full bg-zinc-900 py-1 px-3 text-white hover:bg-zinc-700 dark:bg-emerald-500 dark:text-white dark:hover:bg-emerald-400 w-full"
          >
            <UserAvatar /> Account
          </Link>
        </li>
      </ul>
    </nav>
  );
};

const SideBarLink = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) => {
  const baseClass = "flex-1 font-light transition-colors p-2";
  const linkClass =
    "text-primary/80 hover:text-primary hover:bg-foreground/5 dark:text-zinc-300 dark:hover:text-white dark:hover:bg-zinc-800 dark:focus:bg-zinc-800 dark:focus:text-white";

  const activeLinkClass =
    "text-secondary bg-gradient-to-r from-indigo-500 to-indigo-600 dark:from-indigo-500 dark:to-indigo-600 dark:text-white dark:focus:bg-zinc-800 dark:focus:text-white";

  return (
    <li className="relative mt-3 flex">
      <NavLink
        to={href}
        className={({ isActive, isPending }) =>
          cn(baseClass, isActive ? activeLinkClass : linkClass)
        }
      >
        <span className="flex justify-start items-center">{children}</span>
      </NavLink>
    </li>
  );
};

export default Sidebar;
