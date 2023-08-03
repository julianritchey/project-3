import { Navigate, Outlet } from "react-router-dom";
import { useAccount } from "wagmi";
import LoginModal from "../components/LoginModal";

const PrivateRoutes = () => {
  const { address } = useAccount();
  if (!address) return <Navigate to="/" />;

  return <Outlet />;
};

export default PrivateRoutes;
