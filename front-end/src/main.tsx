import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { WagmiConfig } from "wagmi";
import "./index.css";
import router from "./routes";
import wagmiConfig from "./services/wagmi-config";
import theme from "./theme";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <QueryClientProvider client={queryClient}>
        <WagmiConfig config={wagmiConfig}>
          <RouterProvider router={router} />
          {/* <ReactQueryDevtools /> */}
        </WagmiConfig>
      </QueryClientProvider>
    </ChakraProvider>
  </React.StrictMode>
);
