import { useAuth } from "@/hooks/useAuth";
import { menus, resolvePath } from "@/config/menu";
import { useAppSelector } from "@/store/hooks";
import { useNavigate } from "react-router-dom";
import { ChefHat, HomeIcon } from "lucide-react";

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
  isOpen,
  onClose,
}) => {
  const { logout, user } = useAuth();
  const { activeOrganizationId, activeTenantId } = useAppSelector(
    (s) => s.role
  );
  const activeRole = useAppSelector((s) => s.role?.activeRole);
  const context = activeTenantId ? "tenant" : "organization";
  const navItems = activeRole
    ? menus[activeRole][context]
    : [{ key: "home", label: "Home", path: "/home", icon: HomeIcon }];

  const params = {
    orgId: activeOrganizationId ?? null,
    tenantId: activeTenantId ?? null,
  };

  const navigate = useNavigate();

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
          // base
          "fixed top-0 left-0 h-full w-64 z-50",
          "flex flex-col transition-all duration-300 ease-out",
          // colors
          "bg-white dark:bg-neutral-900",
          "border-r border-neutral-100 dark:border-neutral-800",
          // responsive
          "lg:translate-x-0 lg:static lg:z-auto",
          isOpen ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
      >
        {/* Logo */}
        <div className="p-5 border-b border-neutral-100 dark:border-neutral-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-warm flex items-center justify-center shadow-order shrink-0">
              <ChefHat className="text-white" size={16} />
            </div>
            <div>
              <p className="font-display font-bold text-neutral-900 dark:text-neutral-100 text-base leading-tight">
                Plateform
              </p>
              <p className="text-2xs text-neutral-400 dark:text-neutral-500 font-medium">
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
                const Icon = item.icon;
                const isActive = currentPage === item.key;

                return (
                  <li key={item.key}>
                    <button
                      onClick={() => {
                        if (item.key !== currentPage)
                          navigate(resolvePath(item.path, params));
                        onClose();
                      }}
                      className={[
                        "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150",
                        isActive
                          ? "bg-primary-50 dark:bg-primary-950/40 text-primary-700 dark:text-primary-400"
                          : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-neutral-100",
                      ].join(" ")}
                    >
                      <Icon
                        size={18}
                        className={
                          isActive
                            ? "text-primary-600 dark:text-primary-400"
                            : "text-neutral-400 dark:text-neutral-500"
                        }
                      />
                      <span className="flex-1 text-left">{item.label}</span>
                      {item.badge && (
                        <span className="w-5 h-5 rounded-full bg-primary-500 text-white text-2xs font-bold flex items-center justify-center">
                          {item.badge}
                        </span>
                      )}
                      {isActive && (
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
        <div className="mt-auto shrink-0 border-t border-neutral-100 dark:border-neutral-800 p-3">
          <div className="rounded-2xl border border-neutral-100 dark:border-neutral-700 bg-neutral-50/70 dark:bg-neutral-800/50 p-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-warm text-sm font-bold text-white">
                {user?.name?.charAt(0)?.toUpperCase() || "A"}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                  {user?.name || "Admin User"}
                </p>
                <p className="truncate text-xs text-neutral-400 dark:text-neutral-500">
                  {user?.email || "[Email]"}
                </p>
              </div>
            </div>

            <button
              onClick={logout}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-red-100 dark:border-red-900/40 bg-white dark:bg-neutral-800 px-3 py-2.5 text-sm font-medium text-red-500 dark:text-red-400 transition-all duration-200 hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-600"
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
