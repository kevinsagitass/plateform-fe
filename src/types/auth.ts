import { Subscription, SubscriptionConfig } from "./subscription";

export interface AuthContextType {
  user: User | null;
  token: string;
  subscriptionConfig: SubscriptionConfig;
  isAuthenticated: boolean;
  isLoadingAuth: boolean;

  register: (payload: RegisterPayload) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export interface OrganizationRole {
  organizationId: string;
  role: string;
}

export interface TenantRole {
  tenantId: string;
  role: string;
}

export interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  organizationRoles: OrganizationRole[];
  tenantRoles: TenantRole[];
  subscription: Subscription;
}

export interface RegisterPayload {
  username: string;
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}
