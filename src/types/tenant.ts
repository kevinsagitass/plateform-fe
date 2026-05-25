export interface TenantUsers {
  tenantId: string;
  tenantName: string;
  tenantLocation: string;
  isActive: boolean;
  workHours: TenantWorkHour[];
  organization: {
    organizationId: string;
    name: string;
  };
}

export interface Tenant {
  tenantId?: string;
  organizationId?: string;
  tenantName?: string;
  location?: string;
  tenantWorkHours?: TenantWorkHour[];
  isActive?: boolean;
}

export interface TenantWorkHour {
  tenantWorkHourId?: string;
  tenantId?: string;
  dayOfMonth: number;
  openHour: string;
  closeHour: string;
  isActive?: boolean;
}
