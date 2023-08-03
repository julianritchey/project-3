import { useQuery } from "@tanstack/react-query";
import strategiesService from "../services/strategy-service";
import { Address } from "wagmi";

const useNotification = (
  strategySlug: string,
  userAddress: Address,
  subscriptionPeriod: string
) => {
  console.log("useNotification");
  return useQuery({
    queryKey: [
      "subscription",
      "notification",
      strategySlug,
      userAddress,
      subscriptionPeriod,
    ],
    queryFn: () => {
      console.log("useQuery");
      strategiesService.notify(strategySlug, {
        params: {
          userAddress: userAddress,
          subscriptionPeriod: subscriptionPeriod,
        },
      });
    },
    onSuccess(data) {},
  });
};

export default useNotification;
