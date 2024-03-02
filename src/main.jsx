import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./Routes/Router";
import { HelmetProvider } from "react-helmet-async";
import AuthProvider from "./providers/AuthProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DataProvider } from "./providers/DataContext";
import { ModalContainer } from "reoverlay";
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>      {/* Authentication */}
      <div className="max-w-screen-xl mx-auto">
        <HelmetProvider>        {/* Page Naming */}
          <QueryClientProvider client={queryClient}>   {/* React query */}
            <DataProvider>      {/* Data passing */}
              <RouterProvider router={router} />
            </DataProvider>
          </QueryClientProvider>
          <ModalContainer/>     {/* COMMENT: Container for modal */}
        </HelmetProvider>
      </div>
    </AuthProvider>
  </React.StrictMode>
);
