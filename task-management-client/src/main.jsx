import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes/route.jsx";
import ContextApiProvider from "./utils/ContextApi/ContextApiProvider.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
const queryClient = new QueryClient();
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ContextApiProvider>
      <QueryClientProvider client={queryClient}>
        <RouterProvider future={{ v7_startTransition: true }} router={router}>
          <App />
        </RouterProvider>
      </QueryClientProvider>
    </ContextApiProvider>
  </StrictMode>
);
