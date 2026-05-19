import React from "react";

export type PageKey = "dashboard" | "sales" | "settings";

interface NavItem {
  key: PageKey;
  label: string;
  icon: React.ReactNode;
  badge?: number;
}

interface SidebarProps {
  currentPage: PageKey;
  onNavigate: (page: PageKey) => void;
  isOpen: boolean;
  onClose: () => void;
}

const navItems: NavItem[] = [
  {
    key: "dashboard",
    label: "Dashboard",
    icon: (
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
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
        />
      </svg>
    ),
  },
  {
    key: "sales",
    label: "Sales Report",
    icon: (
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
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        />
      </svg>
    ),
  },
  {
    key: "settings",
    label: "Settings",
    icon: (
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
          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.8}
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
    ),
  },
];

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onNavigate,
  isOpen,
  onClose,
}) => {
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-neutral-950/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={[
          "fixed top-0 left-0 h-full w-64 bg-surface border-r border-neutral-100 z-50",
          "flex flex-col transition-transform duration-300 ease-out",
          "lg:translate-x-0 lg:static lg:z-auto",
          isOpen ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
      >
        {/* Logo */}
        <div className="p-5 border-b border-neutral-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-warm flex items-center justify-center shadow-order">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
            <div>
              <p className="font-display font-bold text-neutral-900 text-base leading-tight">
                Bistro OS
              </p>
              <p className="text-2xs text-neutral-400 font-medium">
                Restaurant Suite
              </p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 overflow-y-auto">
          <p className="text-2xs font-semibold text-neutral-400 uppercase tracking-widest px-3 mb-2 mt-1">
            Main Menu
          </p>
          <ul className="space-y-0.5">
            {navItems.slice(0, 6).map((item) => (
              <li key={item.key}>
                <button
                  onClick={() => {
                    onNavigate(item.key);
                    onClose();
                  }}
                  className={[
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150",
                    currentPage === item.key
                      ? "bg-primary-50 text-primary-700"
                      : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900",
                  ].join(" ")}
                >
                  <span
                    className={
                      currentPage === item.key
                        ? "text-primary-600"
                        : "text-neutral-400"
                    }
                  >
                    {item.icon}
                  </span>
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.badge && (
                    <span className="w-5 h-5 rounded-full bg-primary-500 text-white text-2xs font-bold flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                  {currentPage === item.key && (
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-500" />
                  )}
                </button>
              </li>
            ))}
          </ul>

          <p className="text-2xs font-semibold text-neutral-400 uppercase tracking-widest px-3 mb-2 mt-5">
            System
          </p>
          <ul className="space-y-0.5">
            {navItems.slice(6).map((item) => (
              <li key={item.key}>
                <button
                  onClick={() => {
                    onNavigate(item.key);
                    onClose();
                  }}
                  className={[
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150",
                    currentPage === item.key
                      ? "bg-primary-50 text-primary-700"
                      : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900",
                  ].join(" ")}
                >
                  <span
                    className={
                      currentPage === item.key
                        ? "text-primary-600"
                        : "text-neutral-400"
                    }
                  >
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* User Profile */}
        <div className="p-3 border-t border-neutral-100">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-neutral-50 cursor-pointer transition-colors">
            <div className="w-8 h-8 rounded-full bg-gradient-warm flex items-center justify-center text-white text-xs font-bold shrink-0">
              AM
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-neutral-900 truncate">
                Admin Manager
              </p>
              <p className="text-xs text-neutral-400 truncate">
                admin@bistro.com
              </p>
            </div>
            <svg
              className="w-4 h-4 text-neutral-400 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 9l4-4 4 4m0 6l-4 4-4-4"
              />
            </svg>
          </div>
        </div>
      </aside>
    </>
  );
};
