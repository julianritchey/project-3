import { createBrowserRouter } from "react-router-dom";
import AdminTokensPage from "./pages/AdminTokensPage";
import DashboardPage from "./pages/DashboardPage";
import ErrorPage from "./pages/ErrorPage";
import GetTokensPage from "./pages/GetTokensPage";
import HomePage from "./pages/HomePage";
import Layout from "./pages/Layout";
import StrategiesPage from "./pages/StrategiesPage";
import CreateStrategyPage from "./pages/StrategyCreationPage";
import StrategyDetailPage from "./pages/StrategyDetailsPage";
import StrategyListPage from "./pages/StrategyListPage";
import TokensPage from "./pages/TokensPage";
import TransferTokensPage from "./pages/TransferTokensPage";
import {
  default as AdminRoutes,
  default as PrivateRoutes,
} from "./routing/PrivateRoutes";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <HomePage /> },
      {
        element: <PrivateRoutes />,
        children: [
          { path: "dashboard", element: <DashboardPage /> },
          { path: "strategies", element: <StrategiesPage /> },
          { path: "strategies/list", element: <StrategyListPage /> },
          { path: "strategies/create", element: <CreateStrategyPage /> },
          { path: "strategies/:slug", element: <StrategyDetailPage /> },
          { path: "tokens", element: <TokensPage /> },
          { path: "tokens/get", element: <GetTokensPage /> },
          { path: "tokens/transfer", element: <TransferTokensPage /> },
        ],
      },
      {
        element: <AdminRoutes />,
        children: [{ path: "tokens/admin", element: <AdminTokensPage /> }],
      },
    ],
  },
]);

export default router;
