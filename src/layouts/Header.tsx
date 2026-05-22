import { PageKey } from "./Sidebar";
import BreadcrumbNav from "@/components/ui/BreadcrumbNav";
import { DarkModeToggle } from "@/components/ui/DarkModeToggle";

interface HeaderProps {
  currentPage: PageKey;
  onMenuToggle: () => void;
}

const pageTitles: Record<PageKey, { title: string }> = {
  home: { title: "Home" },
  dashboard: { title: "Dashboard" },
  users: { title: "Users" },
  settings: { title: "Settings" },
  tenants: { title: "Tenants" },
  reports: { title: "Reports" },
  tables: { title: "Tables" },
  orders: { title: "Orders" },
  reservations: { title: "Reservations" },
  stocks: { title: "Stocks" },
};

export const Header: React.FC<HeaderProps> = ({
  currentPage,
  onMenuToggle,
}) => {
  const { title } = pageTitles[currentPage];

  return (
    <header className="h-16 bg-white dark:bg-neutral-900 border-b border-neutral-100 dark:border-neutral-800 flex items-center px-4 lg:px-6 gap-4 sticky top-0 z-30 transition-colors duration-200">
      {/* Mobile menu toggle */}
      <button
        onClick={onMenuToggle}
        className="lg:hidden w-9 h-9 rounded-lg flex items-center justify-center text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {/* Title */}
      <div className="flex-1 min-w-0">
        <h1 className="font-display font-bold text-neutral-900 dark:text-neutral-100 text-lg leading-tight truncate">
          {title}
        </h1>
        <div className="text-xs text-neutral-400 dark:text-neutral-500 hidden sm:block truncate">
          <BreadcrumbNav />
        </div>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-2">
        {/* Search */}
        <button className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-400 dark:text-neutral-500 text-sm hover:border-neutral-300 dark:hover:border-neutral-600 transition-colors w-48">
          <svg
            className="w-4 h-4 shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <span className="text-xs">Search...</span>
          <span className="ml-auto text-2xs bg-neutral-200 dark:bg-neutral-700 text-neutral-500 dark:text-neutral-400 px-1.5 py-0.5 rounded font-mono">
            ⌘K
          </span>
        </button>

        {/* Notifications */}
        <button className="relative w-9 h-9 rounded-lg flex items-center justify-center text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.8}
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary-500 ring-2 ring-white dark:ring-neutral-900" />
        </button>

        {/* Dark Mode Toggle */}
        <DarkModeToggle />

        {/* Divider */}
        <div className="hidden lg:block w-px h-5 bg-neutral-200 dark:bg-neutral-700" />

        {/* Date */}
        <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-50 dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 transition-colors">
          <svg
            className="w-3.5 h-3.5 text-neutral-400 dark:text-neutral-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <span className="text-xs text-neutral-600 dark:text-neutral-400 font-medium">
            {new Date().toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
            })}
          </span>
        </div>
      </div>
    </header>
  );
};
