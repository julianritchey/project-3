import { Navigate } from "react-router-dom";

const TokensPage = () => {
  return <Navigate to="/tokens/get" replace={true} />;
};

export default TokensPage;
