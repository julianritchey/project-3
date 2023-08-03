import { Navigate, Outlet } from "react-router-dom";
import { Address, useAccount } from "wagmi";

const AdminRoutes = () => {
  const { address } = useAccount();
  if (
    !address ||
    address !== (import.meta.env.VITE_IDT_OWNER_ADDRESS as Address)
  )
    return <Navigate to="/" />;

  return <Outlet />;
};

export default AdminRoutes;
