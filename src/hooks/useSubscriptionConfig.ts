import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { getSubscriptionConfig } from "@/services/SubscriptionService";

const useSubscriptionConfig = () => {
  const { user } = useAuth();

  const { data: subscriptionConfig, isLoading } = useQuery({
    queryKey: ["subscriptionConfig", user?.subscription?.plan],
    queryFn: async () => {
      const res = await getSubscriptionConfig(user?.subscription?.plan);
      return res.data;
    },
    enabled: !!user,
    staleTime: 1000 * 60 * 15,
  });

  return { subscriptionConfig, isLoading };
};

export default useSubscriptionConfig;
