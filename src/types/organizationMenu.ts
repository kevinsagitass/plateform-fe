export interface PaginationMeta {
  organizationId: string;
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedMenuItemsResponse {
  result: MenuItem[];
  pagination: PaginationMeta;
}

export interface MenuCategory {
  id: string;
  categoryName: string;
  organizationId: string;
  orderNumber: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MenuItem {
  id: string;
  organizationId: string;
  name: string;
  description: string;
  imagePath: string;
  price: number;
  discount: number;
  category: {
    id: string;
    categoryName: string;
  };
  isAvailable: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// ─── Addon Group ───────────────────────────────────────────────
export interface AddonGroup {
  id: string;
  organizationMenuId: string;
  name: string;
  isRequired: boolean;
  maxSelection: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  addons?: Addon[];
}

export interface CreateAddonGroupPayload {
  organizationMenuId: string;
  name: string;
  isRequired: boolean;
  maxSelection: number;
}

export interface UpdateAddonGroupPayload {
  name?: string;
  isRequired?: boolean;
  maxSelection?: number;
}

// ─── Addon ─────────────────────────────────────────────────────
export interface Addon {
  id: string;
  organizationAddonGroupId: string;
  name: string;
  price: number;
  isAvailable: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAddonPayload {
  name: string;
  price: number;
  isAvailable: boolean;
}

export interface UpdateAddonPayload {
  name?: string;
  price?: number;
  isAvailable?: boolean;
}

// ─── Existing payloads (unchanged) ─────────────────────────────
export interface CreateMenuCategoryPayload {
  categoryName: string;
  orderNumber: number;
  isActive: boolean;
}

export interface UpdateMenuCategoryPayload {
  id: string;
  categoryName?: string;
  orderNumber?: number;
  isActive?: boolean;
}

export interface CreateMenuItemPayload {
  organizationCategoryId: string | null;
  name: string;
  description: string;
  image: File | null;
  price: number;
  discount: number;
  isAvailable: boolean;
  isActive: boolean;
}

export interface UpdateMenuItemPayload {
  organizationCategoryId?: string | null;
  name?: string;
  description?: string;
  image?: File | null;
  price?: number;
  discount?: number;
  isAvailable?: boolean;
  isActive?: boolean;
}
