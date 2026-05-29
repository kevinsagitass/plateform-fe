import {
  MenuCategory,
  MenuItem,
  CreateMenuCategoryPayload,
  UpdateMenuCategoryPayload,
  CreateMenuItemPayload,
  UpdateMenuItemPayload,
  AddonGroup,
  CreateAddonGroupPayload,
  UpdateAddonGroupPayload,
  Addon,
  CreateAddonPayload,
  UpdateAddonPayload,
  PaginatedMenuItemsResponse,
} from "@/types/organizationMenu";
import api from "../config/api";
import { ApiResponse } from "@/types";

// ===== MENU CATEGORIES =====

export const getOrganizationMenuCategories = async (
  organizationId: string
): Promise<{ data: MenuCategory[] }> => {
  const result = await api.get<ApiResponse<MenuCategory[]>>(
    `/organization-menus/categories/${organizationId}`
  );

  return result.data;
};

export const createMenuCategory = async (
  organizationId: string,
  payload: CreateMenuCategoryPayload
): Promise<{ data: MenuCategory }> => {
  const result = await api.post<ApiResponse<MenuCategory[]>>(
    `/organization-menus/categories/${organizationId}`,
    payload
  );

  return result.data;
};

export const updateMenuCategory = async (
  organizationId: string,
  payload: UpdateMenuCategoryPayload
): Promise<{ data: MenuCategory }> => {
  const result = await api.patch<ApiResponse<MenuCategory[]>>(
    `/organization-menus/categories/${organizationId}`,
    payload
  );

  return result.data;
};

export const deleteMenuCategory = async (
  organizationId: string,
  categoryId: string
): Promise<void> => {
  const result = await api.delete<ApiResponse<MenuCategory[]>>(
    `/organization-menus/categories/${organizationId}/${categoryId}`
  );

  return result.data;
};

// ===== MENUS =====

export const getOrganizationMenuItems = async (
  organizationId: string,
  params?: {
    page?: number;
    limit?: number;
    search?: string;
    categoryId?: string;
  }
): Promise<{ data: PaginatedMenuItemsResponse }> => {
  const query = new URLSearchParams();

  if (params?.page) query.set("page", String(params.page));
  if (params?.limit) query.set("limit", String(params.limit));
  if (params?.search) query.set("search", params.search);
  if (params?.categoryId) query.set("categoryId", params.categoryId);

  const result = await api.get(
    `/organization-menus/${organizationId}?${query.toString()}`
  );

  return result.data;
};

export const createMenuItem = async (
  organizationId: string,
  payload: CreateMenuItemPayload
): Promise<{ data: MenuItem }> => {
  const formData = new FormData();

  formData.append("name", payload.name);
  formData.append("description", payload.description);
  formData.append("price", String(payload.price));
  formData.append("discount", String(payload.discount));
  formData.append("isAvailable", String(payload.isAvailable));
  formData.append("isActive", String(payload.isActive));
  if (payload.organizationCategoryId) {
    formData.append("organizationCategoryId", payload.organizationCategoryId);
  }
  if (payload.image) {
    formData.append("image", payload.image);
  }

  const result = await api.post<ApiResponse<MenuItem>>(
    `/organization-menus/${organizationId}`,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );

  return result.data;
};

export const updateMenuItem = async (
  organizationId: string,
  menuItemId: string,
  payload: UpdateMenuItemPayload
): Promise<{ data: MenuItem }> => {
  const formData = new FormData();

  if (payload.name !== undefined) formData.append("name", payload.name);
  if (payload.description !== undefined)
    formData.append("description", payload.description);
  if (payload.price !== undefined)
    formData.append("price", String(payload.price));
  if (payload.discount !== undefined)
    formData.append("discount", String(payload.discount));
  if (payload.isAvailable !== undefined)
    formData.append("isAvailable", String(payload.isAvailable));
  if (payload.isActive !== undefined)
    formData.append("isActive", String(payload.isActive));
  if (payload.organizationCategoryId !== undefined)
    formData.append(
      "organizationCategoryId",
      payload.organizationCategoryId ?? ""
    );
  if (payload.image) {
    formData.append("image", payload.image);
  }

  const result = await api.patch<ApiResponse<MenuItem>>(
    `/organization-menus/${organizationId}/${menuItemId}`,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );

  return result.data;
};

export const deleteMenuItem = async (
  organizationId: string,
  menuItemId: string
): Promise<void> => {
  const result = await api.delete<ApiResponse<MenuItem>>(
    `/organization-menus/${organizationId}/${menuItemId}`
  );

  return result.data;
};

// ===== ADDON GROUPS =====

export const getAddonGroups = async (orgId: string, menuItemId: string) => {
  const result = await api.get<{ data: AddonGroup[] }>(
    `/organization-menus/${orgId}/${menuItemId}/addon-groups`
  );

  return result.data;
};

export const createAddonGroup = async (
  orgId: string,
  payload: CreateAddonGroupPayload
) => {
  const result = await api.post<{ data: AddonGroup }>(
    `/organization-menus/${orgId}/addon-groups`,
    payload
  );

  return result.data;
};

export const updateAddonGroup = async (
  orgId: string,
  groupId: string,
  payload: UpdateAddonGroupPayload
) => {
  const result = await api.patch<{ data: AddonGroup }>(
    `/organization-menus/${orgId}/addon-groups/${groupId}`,
    payload
  );

  return result.data;
};

export const deleteAddonGroup = async (orgId: string, groupId: string) => {
  const result = await api.delete(
    `/organization-menus/${orgId}/addon-groups/${groupId}`
  );

  return result.data;
};

// ===== ADDONS =====

export const createAddon = (
  orgId: string,
  groupId: string,
  payload: CreateAddonPayload
) => {
  const result = api.post<{ data: Addon }>(
    `/organization-menus/${orgId}/${groupId}/addons/`,
    payload
  );

  return result.data;
};

export const updateAddon = async (
  orgId: string,
  groupId: string,
  addonId: string,
  payload: UpdateAddonPayload
) => {
  const result = await api.patch<{ data: Addon }>(
    `/organization-menus/${orgId}/${groupId}/addons/${addonId}`,
    payload
  );

  return result.data;
};

export const deleteAddon = async (
  orgId: string,
  groupId: string,
  addonId: string
) => {
  const result = await api.delete(
    `/organization-menus/${orgId}/${groupId}/addons/${addonId}`
  );

  return result.data;
};
