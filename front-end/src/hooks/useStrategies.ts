import { useQuery } from "@tanstack/react-query";
import ms from "ms";
import strategiesService from "../services/strategy-service";
import Strategy from "../entities/Strategy";

const useStrategies = () => {
  return useQuery({
    queryKey: ["strategies"],
    queryFn: () => strategiesService.getAll({}),
    staleTime: ms("24h"),
  });
};

export default useStrategies;
