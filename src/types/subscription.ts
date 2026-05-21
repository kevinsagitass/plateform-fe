export type PLAN = "FREE" | "BASIC" | "PRO" | "ENTERPRISE";

export type STATUS = "ACTIVE" | "EXPIRED" | "CANCELLED";

export interface Subscription {
  plan: PLAN;
  status: STATUS;
}

export interface SubscriptionConfig {
  plan: PLAN;
  maxOrganization: number;
  maxTenant: number;
}
