export type Role =
  | "OWNER"
  | "ADMIN"
  | "STAFF"
  | "STORE_MANAGER"
  | "CASHIER"
  | "COOK";

export type OrganizationRole = "OWNER" | "ADMIN" | "STAFF";

export type TenantRole = "STORE_MANAGER" | "CASHIER" | "COOK";

export interface OrgUserRole {
  userId: string;
  organizationId: string;
  name: string;
  email: string;
  role: OrganizationRole;
  joinedAt: string;
}

export interface TenantUserRole {
  userId: string;
  tenantId: string;
  name: string;
  email: string;
  role: TenantRole;
  joinedAt: string;
}

export interface InviteOrganizationMember {
  email: string;
  role: OrganizationRole;
}
