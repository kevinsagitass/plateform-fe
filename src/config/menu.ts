import {
  HomeIcon,
  UsersIcon,
  ChartBarIcon,
  UtensilsIcon,
  ShoppingCartIcon,
  WarehouseIcon,
  Grid2X2CheckIcon,
  BookCheckIcon,
  StoreIcon,
  ChartPieIcon,
} from "lucide-react";

export type Role = "OWNER" | "ADMIN" | "STORE_MANAGER" | "CASHIER" | "COOK";

export interface MenuItem {
  key: string;
  label: string;
  path: string | ((params: Record<string, string>) => string);
  icon: React.ElementType;
}

export interface MenuConfig {
  organization: MenuItem[];
  tenant: MenuItem[];
}

export const menus: Record<Role, MenuConfig> = {
  OWNER: {
    organization: [
      {
        key: "home",
        label: "Home",
        path: "/home",
        icon: HomeIcon,
      },
      {
        key: "dashboard",
        label: "Dashboard",
        path: (params) => `/organization/${params.orgId}/dashboard`,
        icon: ChartPieIcon,
      },
      {
        key: "users",
        label: "Organization Users",
        path: (params) => `/organization/${params.orgId}/users`,
        icon: UsersIcon,
      },
      {
        key: "tenants",
        label: "Tenants",
        path: (params) => `/organization/${params.orgId}/tenants`,
        icon: StoreIcon,
      },
      {
        key: "reports",
        label: "Organization Reports",
        path: (params) => `/organization/${params.orgId}/reports`,
        icon: ChartBarIcon,
      },
    ],
    tenant: [
      {
        key: "dashboard",
        label: "Dashboard",
        path: (params) =>
          `/organization/${params.orgId}/tenant/${params.tenantId}/dashboard`,
        icon: ChartPieIcon,
      },
      {
        key: "users",
        label: "Tenant Users",
        path: (params) =>
          `/organization/${params.orgId}/tenant/${params.tenantId}/users`,
        icon: UsersIcon,
      },
      {
        key: "reports",
        label: "Reports",
        path: (params) =>
          `/organization/${params.orgId}/tenant/${params.tenantId}/dashboard`,
        icon: ChartBarIcon,
      },
    ],
  },

  ADMIN: {
    organization: [
      {
        key: "home",
        label: "Home",
        path: "/home",
        icon: HomeIcon,
      },
      {
        key: "dashboard",
        label: "Dashboard",
        path: (params) => `/organization/${params.orgId}/dashboard`,
        icon: ChartPieIcon,
      },
      {
        key: "users",
        label: "Organization Users",
        path: (params) => `/organization/${params.orgId}/users`,
        icon: UsersIcon,
      },
      {
        key: "tenants",
        label: "Tenants",
        path: (params) => `/organization/${params.orgId}/tenants`,
        icon: StoreIcon,
      },
      {
        key: "reports",
        label: "Organization Reports",
        path: (params) => `/organization/${params.orgId}/reports`,
        icon: ChartBarIcon,
      },
    ],
    tenant: [
      {
        key: "dashboard",
        label: "Dashboard",
        path: (params) =>
          `/organization/${params.orgId}/tenant/${params.tenantId}/dashboard`,
        icon: ChartPieIcon,
      },
      {
        key: "users",
        label: "Tenant Users",
        path: (params) =>
          `/organization/${params.orgId}/tenant/${params.tenantId}/users`,
        icon: UsersIcon,
      },
      {
        key: "tables",
        label: "Tables",
        path: (params) =>
          `/organization/${params.orgId}/tenant/${params.tenantId}/tables`,
        icon: Grid2X2CheckIcon,
      },
      {
        key: "reports",
        label: "Reports",
        path: (params) =>
          `/organization/${params.orgId}/tenant/${params.tenantId}/dashboard`,
        icon: ChartBarIcon,
      },
    ],
  },

  STORE_MANAGER: {
    organization: [
      {
        key: "home",
        label: "Home",
        path: "/home",
        icon: HomeIcon,
      },
    ],
    tenant: [
      {
        key: "dashboard",
        label: "Dashboard",
        path: (params) =>
          `/organization/${params.orgId}/tenant/${params.tenantId}/dashboard`,
        icon: ChartPieIcon,
      },
      {
        key: "users",
        label: "Users",
        path: (params) =>
          `/organization/${params.orgId}/tenant/${params.tenantId}/users`,
        icon: UsersIcon,
      },
      {
        key: "tables",
        label: "Tables",
        path: (params) =>
          `/organization/${params.orgId}/tenant/${params.tenantId}/tables`,
        icon: Grid2X2CheckIcon,
      },
      {
        key: "menus",
        label: "Menus",
        path: (params) =>
          `/organization/${params.orgId}/tenant/${params.tenantId}/menus`,
        icon: UtensilsIcon,
      },
      {
        key: "orders",
        label: "Orders",
        path: (params) =>
          `/organization/${params.orgId}/tenant/${params.tenantId}/orders`,
        icon: ShoppingCartIcon,
      },
      {
        key: "reservations",
        label: "Reservations",
        path: (params) =>
          `/organization/${params.orgId}/tenant/${params.tenantId}/reservations`,
        icon: BookCheckIcon,
      },
      {
        key: "reports",
        label: "Reports",
        path: (params) =>
          `/organization/${params.orgId}/tenant/${params.tenantId}/reports`,
        icon: ChartBarIcon,
      },
    ],
  },

  CASHIER: {
    organization: [
      {
        key: "home",
        label: "Home",
        path: "/home",
        icon: HomeIcon,
      },
    ],
    tenant: [
      {
        key: "dashboard",
        label: "Dashboard",
        path: (params) =>
          `/organization/${params.orgId}/tenant/${params.tenantId}/dashboard`,
        icon: ChartPieIcon,
      },
      {
        key: "orders",
        label: "Orders",
        path: (params) =>
          `/organization/${params.orgId}/tenant/${params.tenantId}/orders`,
        icon: ShoppingCartIcon,
      },
      {
        key: "reservations",
        label: "Reservations",
        path: (params) =>
          `/organization/${params.orgId}/tenant/${params.tenantId}/reservations`,
        icon: BookCheckIcon,
      },
    ],
  },

  COOK: {
    organization: [
      {
        key: "home",
        label: "Home",
        path: "/home",
        icon: HomeIcon,
      },
    ],
    tenant: [
      {
        key: "dashboard",
        label: "Dashboard",
        path: (params) =>
          `/organization/${params.orgId}/tenant/${params.tenantId}/dashboard`,
        icon: ChartPieIcon,
      },
      {
        key: "stocks",
        label: "Stocks",
        path: (params) =>
          `/organization/${params.orgId}/tenant/${params.tenantId}/stocks`,
        icon: WarehouseIcon,
      },
    ],
  },
};

export const resolvePath = (
  path: MenuItem["path"],
  params: Record<string, string>
): string => {
  if (typeof path === "function") return path(params);
  return path;
};
