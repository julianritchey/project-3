import { useQuery } from "@tanstack/react-query";
import strategiesService from "../services/strategy-service";

const useStrategy = (slug: string) => {
  return useQuery({
    queryKey: ["strategies", slug],
    queryFn: () => strategiesService.get(slug, {}),
  });
};

export default useStrategy;
