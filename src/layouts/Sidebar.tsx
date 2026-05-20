import React from "react";
import { useAuth } from "@/hooks/useAuth";
import { menus, resolvePath } from "@/config/menu";
import { useAppSelector } from "@/store/hooks";
import { useParams } from "react-router-dom";
import { HomeIcon } from "lucide-react";

export type PageKey =
  | "home"
  | "dashboard"
  | "users"
  | "tenants"
  | "reports"
  | "tables"
  | "orders"
  | "reservations"
  | "stocks"
  | "settings";

interface SidebarProps {
  currentPage: PageKey;
  onNavigate: (page: PageKey) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onNavigate,
  isOpen,
  onClose,
}) => {
  const { logout, user } = useAuth();
  const { orgId, tenantId } = useParams();
  const activeRole = useAppSelector((state) => state.role?.activeRole);
  const context = tenantId ? "tenant" : "organization";
  const navItems = activeRole
    ? menus[activeRole][context]
    : [
        {
          key: "home",
          label: "Home",
          path: "/home",
          icon: HomeIcon,
        },
      ];

  const params = {
    orgId: orgId ?? null,
    tenantId: tenantId ?? null,
  };

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
        {navItems && (
          <nav className="flex-1 p-3 overflow-y-auto">
            <ul className="space-y-0.5">
              {navItems.map((item) => {
                const Icon = item.icon; // ← ⚠️ harus capitalize

                return (
                  <li key={item.key}>
                    <button
                      onClick={() => {
                        onNavigate(resolvePath(item.path, params));
                        onClose();
                      }}
                      className={[
                        "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150",
                        currentPage === item.key
                          ? "bg-primary-50 text-primary-700"
                          : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900",
                      ].join(" ")}
                    >
                      {/* ✅ Fix disini */}
                      <Icon
                        size={18}
                        className={
                          currentPage === item.key
                            ? "text-primary-600"
                            : "text-neutral-400"
                        }
                      />

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
                );
              })}
            </ul>
          </nav>
        )}

        {/* User Profile */}
        <div className="mt-auto shrink-0 border-t border-neutral-100 p-3">
          <div className="rounded-2xl border border-neutral-100 bg-neutral-50/70 p-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-warm text-sm font-bold text-white">
                {user?.name?.charAt(0)?.toUpperCase() || "A"}
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-neutral-900">
                  {user?.name || "Admin User"}
                </p>

                <p className="truncate text-xs text-neutral-400">
                  {user?.email || "admin@plateform.com"}
                </p>
              </div>
            </div>

            <button
              onClick={logout}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-red-100 bg-white px-3 py-2.5 text-sm font-medium text-red-500 transition-all duration-200 hover:bg-red-50 hover:text-red-600"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H6a2 2 0 01-2-2V7a2 2 0 012-2h5a2 2 0 012 2v1"
                />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
