import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAccount } from "wagmi";

const useAuth = () => {
  const navigate = useNavigate();
  const { address: userAddress } = useAccount();
  useEffect(() => {
    userAddress !== import.meta.env.VITE_IDT_OWNER_ADDRESS && navigate("/");
  });
};

export default useAuth;
