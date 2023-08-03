import { useQuery } from "@tanstack/react-query";
import User from "../entities/User";
import APIClient from "../services/api-client";
import { Address } from "viem";

const apiClient = new APIClient<User>("/users");

const useUser = (address: Address) => {
  {
    return useQuery({
      queryKey: ["address", address],
      queryFn: () => apiClient.get(address, {}),
    });
  }
};

export default useUser;
