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
