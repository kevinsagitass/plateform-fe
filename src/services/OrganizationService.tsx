import { ApiResponse } from "@/types";
import api from "../config/api";
import { OrganizationUser } from "@/types/organization";

export const getUserOrganizations = async (): Promise<
  ApiResponse<OrganizationUser[]>
> => {
  const result = await api.get<ApiResponse<OrganizationUser[]>>(
    "/organizations"
  );

  return result.data;
};

export const getUserOrganizationRole = async (
  organizationId: string
): Promise<ApiResponse<string>> => {
  const result = await api.get<ApiResponse<string>>(
    `/organizations/${organizationId}/role`
  );

  return result.data;
};

export const createOrganization = async (organization: {
  name: string;
}): Promise<ApiResponse<any>> => {
  const result = await api.post<ApiResponse<any>>(
    `/organizations`,
    organization
  );

  return result.data;
};
