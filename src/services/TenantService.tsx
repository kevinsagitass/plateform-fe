import { ApiResponse } from "@/types";
import api from "../config/api";
import { TenantUsers } from "@/types/tenant";

export const getUserTenants = async (
  organizationId: string
): Promise<ApiResponse<TenantUsers[]>> => {
  const result = await api.get<ApiResponse<TenantUsers[]>>(
    `/tenants/organization/${organizationId}`
  );

  return result.data;
};

export const getUserTenantRole = async (
  tenantId: string
): Promise<ApiResponse<string>> => {
  const result = await api.get<ApiResponse<string>>(
    `/tenants/${tenantId}/role`
  );

  return result.data;
};
