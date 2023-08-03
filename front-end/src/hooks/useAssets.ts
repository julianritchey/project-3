import { useQuery } from "@tanstack/react-query";
import ms from "ms";
import Asset from "../entities/Asset";
import APIClient from "../services/api-client";

const apiClient = new APIClient<Asset>("/assets/us-equities");

const useAssets = () => {
  return useQuery({
    queryKey: ["assets-us-equities"],
    queryFn: () => apiClient.getAll({}),
    staleTime: ms("24h"),
  });
};

export default useAssets;
