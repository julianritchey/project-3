import { Address } from "viem";

export default interface User {
  user_id: number;
  address: Address;
  first_name: string;
  last_name: string;
  email: string;
  mobile: string;
}
