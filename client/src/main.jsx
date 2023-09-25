import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";
import { NextUIProvider } from "@nextui-org/react";
import CreatePageForm from "./pages/CreatePageForm.jsx";
import ConnectAccountForm from "./pages/ConnectAccountForm.jsx";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/complete-page",
    element: <CreatePageForm />,
  },
  {
    path: "/connect-withdrawal-account",
    element: <ConnectAccountForm />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <NextUIProvider className="h-screen">
      <main className="dark text-foreground bg-background min-h-full">
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
        </QueryClientProvider>
      </main>
    </NextUIProvider>
  </React.StrictMode>
);
