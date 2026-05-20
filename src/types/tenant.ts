export interface TenantUsers {
  tenantId: string;
  tenantName: string;
  tenantLocation: string;
  isActive: boolean;
  organization: {
    organizationId: string;
    name: string;
  };
}
