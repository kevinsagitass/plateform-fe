import { ApiResponse } from "@/types";
import api from "../config/api";
import { InviteOrganizationMember, OrganizationRole } from "@/types/role";

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
