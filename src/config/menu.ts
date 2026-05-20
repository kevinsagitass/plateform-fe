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
        key: "dashboard",
        label: "Dashboard",
        path: (params) => `/organization/${params.orgId}/dashboard`,
        icon: HomeIcon,
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
          `/organization/${params.orgId}/${params.tenantId}/dashboard`,
        icon: HomeIcon,
      },
      {
        key: "users",
        label: "Tenant Users",
        path: (params) =>
          `/organization/${params.orgId}/${params.tenantId}/users`,
        icon: UsersIcon,
      },
      {
        key: "reports",
        label: "Reports",
        path: (params) =>
          `/organization/${params.orgId}/${params.tenantId}/dashboard`,
        icon: ChartBarIcon,
      },
    ],
  },

  ADMIN: {
    organization: [
      {
        key: "dashboard",
        label: "Dashboard",
        path: (params) => `/organization/${params.orgId}/dashboard`,
        icon: HomeIcon,
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
          `/organization/${params.orgId}/${params.tenantId}/dashboard`,
        icon: HomeIcon,
      },
      {
        key: "users",
        label: "Tenant Users",
        path: (params) =>
          `/organization/${params.orgId}/${params.tenantId}/users`,
        icon: UsersIcon,
      },
      {
        key: "tables",
        label: "Tables",
        path: (params) =>
          `/organization/${params.orgId}/${params.tenantId}/tables`,
        icon: Grid2X2CheckIcon,
      },
      {
        key: "reports",
        label: "Reports",
        path: (params) =>
          `/organization/${params.orgId}/${params.tenantId}/dashboard`,
        icon: ChartBarIcon,
      },
    ],
  },

  STORE_MANAGER: {
    organization: [],
    tenant: [
      {
        key: "dashboard",
        label: "Dashboard",
        path: (params) =>
          `/organization/${params.orgId}/${params.tenantId}/dashboard`,
        icon: HomeIcon,
      },
      {
        key: "users",
        label: "Users",
        path: (params) =>
          `/organization/${params.orgId}/${params.tenantId}/users`,
        icon: UsersIcon,
      },
      {
        key: "tables",
        label: "Tables",
        path: (params) =>
          `/organization/${params.orgId}/${params.tenantId}/tables`,
        icon: Grid2X2CheckIcon,
      },
      {
        key: "menus",
        label: "Menus",
        path: (params) =>
          `/organization/${params.orgId}/${params.tenantId}/menus`,
        icon: UtensilsIcon,
      },
      {
        key: "orders",
        label: "Orders",
        path: (params) =>
          `/organization/${params.orgId}/${params.tenantId}/orders`,
        icon: ShoppingCartIcon,
      },
      {
        key: "reservations",
        label: "Reservations",
        path: (params) =>
          `/organization/${params.orgId}/${params.tenantId}/reservations`,
        icon: BookCheckIcon,
      },
      {
        key: "reports",
        label: "Reports",
        path: (params) =>
          `/organization/${params.orgId}/${params.tenantId}/reports`,
        icon: ChartBarIcon,
      },
    ],
  },

  CASHIER: {
    organization: [],
    tenant: [
      {
        key: "dashboard",
        label: "Dashboard",
        path: (params) =>
          `/organization/${params.orgId}/${params.tenantId}/dashboard`,
        icon: HomeIcon,
      },
      {
        key: "orders",
        label: "Orders",
        path: (params) =>
          `/organization/${params.orgId}/${params.tenantId}/orders`,
        icon: ShoppingCartIcon,
      },
      {
        key: "reservations",
        label: "Reservations",
        path: (params) =>
          `/organization/${params.orgId}/${params.tenantId}/reservations`,
        icon: BookCheckIcon,
      },
    ],
  },

  COOK: {
    organization: [],
    tenant: [
      {
        key: "dashboard",
        label: "Dashboard",
        path: (params) =>
          `/organization/${params.orgId}/${params.tenantId}/dashboard`,
        icon: HomeIcon,
      },
      {
        key: "stocks",
        label: "Stocks",
        path: (params) =>
          `/organization/${params.orgId}/${params.tenantId}/stocks`,
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
