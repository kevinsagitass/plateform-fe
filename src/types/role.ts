export type Role = "OWNER" | "ADMIN" | "STORE_MANAGER" | "CASHIER" | "COOK";

export type OrganizationRole = "OWNER" | "ADMIN";

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

export interface InviteTenantMember {
  email: string;
  role: TenantRole;
}
