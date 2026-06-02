import { ApiResponse } from "@/types";
import api from "../config/api";
import {
  InviteOrganizationMember,
  InviteTenantMember,
  OrganizationRole,
  OrgUserRole,
  TenantRole,
  TenantUserRole,
} from "@/types/role";

export const getAllOrganizationUsersRole = async (
  organizationId: string
): Promise<ApiResponse<OrgUserRole[]>> => {
  const result = await api.get<ApiResponse<OrgUserRole[]>>(
    `/roles/organizations/${organizationId}`
  );

  return result.data;
};

export const inviteOrganizationMember = async (
  organizationId: string,
  data: InviteOrganizationMember
): Promise<ApiResponse<string>> => {
  const result = await api.post<ApiResponse<string>>(
    `/roles/organizations/${organizationId}/invite`,
    data
  );

  return result.data;
};

export const removeOrganizationUser = async (
  organizationId: string,
  userId: string,
  role: OrganizationRole
): Promise<ApiResponse<string>> => {
  const result = await api.delete<ApiResponse<string>>(
    `/roles/organizations/${organizationId}/${userId}/${role}`
  );

  return result.data;
};

export const getAllTenantUsersRole = async (
  tenantId: string
): Promise<ApiResponse<TenantUserRole[]>> => {
  const result = await api.get<ApiResponse<TenantUserRole[]>>(
    `/roles/tenants/${tenantId}`
  );

  return result.data;
};

export const inviteTenantMember = async (
  tenantId: string,
  data: InviteTenantMember
): Promise<ApiResponse<string>> => {
  const result = await api.post<ApiResponse<string>>(
    `/roles/tenants/${tenantId}/invite`,
    data
  );

  return result.data;
};

export const editTenantUserRole = async (
  organizationId: string,
  tenantId: string,
  userId: string,
  role: TenantRole,
  newRole: TenantRole
): Promise<ApiResponse<any>> => {
  const result = await api.patch<ApiResponse<any>>(
    `/roles/${organizationId}/tenants/${tenantId}/${userId}/${role}`,
    {
      newRole,
    }
  );

  return result.data;
};

export const removeTenantUser = async (
  organizationId: string,
  tenantId: string,
  userId: string,
  role: TenantRole
): Promise<ApiResponse<any>> => {
  const result = await api.delete<ApiResponse<any>>(
    `/roles/${organizationId}/tenants/${tenantId}/${userId}/${role}`
  );

  return result.data;
};
