import { Address } from "viem";
import { create } from "zustand";

interface UserAddress {
  address?: Address;
}

interface UserAddressStore {
  userAddress: UserAddress;
  setUserAddress: (address: Address) => void;
}

const useUserAddressStore = create<UserAddressStore>((set) => ({
  userAddress: {},
  setUserAddress: (address) => set(() => ({ userAddress: { address } })),
}));

export default useUserAddressStore;
