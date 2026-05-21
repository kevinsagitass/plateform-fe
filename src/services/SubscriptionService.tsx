import { ApiResponse } from "@/types";
import api from "../config/api";
import { SubscriptionConfig } from "@/types/subscription";

export const getSubscriptionConfig = async (
  plan: string
): Promise<ApiResponse<SubscriptionConfig>> => {
  const result = await api.get<ApiResponse<SubscriptionConfig>>(
    `/subscriptions/${plan}`
  );

  return result.data;
};
