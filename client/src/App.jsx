import { useState } from "react";
import { NextUIProvider } from "@nextui-org/react";
import CreatePageForm from "./pages/CreatePageForm.jsx";
import ConnectAccountForm from "./pages/ConnectAccountForm.jsx";
import { QueryClient, QueryClientProvider } from "react-query";
import {
  ClerkProvider,
  RedirectToSignIn,
  SignIn,
  SignedIn,
  SignedOut,
} from "@clerk/clerk-react";
import LandingPage from "./pages/LandingPage.jsx";
import {
  createBrowserRouter,
  Route,
  RouterProvider,
  Routes,
  useNavigate,
} from "react-router-dom";
import SignUpPage from "./pages/SignUpPage.jsx";
import SignInPage from "./pages/SignInPage.jsx";
import RequireAuth from "./components/RequireAuth.jsx";
import RequireUserPage from "./components/RequireUserPage.jsx";
import CustomPage from "./pages/CustomPage.jsx";

const clerkPublicKey = import.meta.env.VITE_APP_CLERK_PUBLISHABLE_KEY;

function App() {
  const navigate = useNavigate();
  const router = createBrowserRouter([
    {
      path: "/",
      element: <LandingPage />,
    },
    {
      path: "/sign-up",
      element: <SignUpPage />,
    },
    {
      path: "/sign-in",
      element: <SignInPage />,
    },
    {
      path: "/complete-page",
      element: (
        <SignedIn>
          <CreatePageForm />
        </SignedIn>
      ),
    },
    {
      path: "/connect-withdrawal-account",
      element: (
        <RequireAuth>
          <RequireUserPage>
            <ConnectAccountForm />
          </RequireUserPage>
        </RequireAuth>
      ),
    },
  ]);

  return (
    <ClerkProvider
      publishableKey={clerkPublicKey}
      navigate={(to) => navigate(to)}
    >
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/sign-in/*" element={<SignInPage />} />
        <Route path="/sign-up/*" element={<SignUpPage />} />
        <Route path="/:slug" element={<CustomPage />} />
        <Route element={<RequireAuth />}>
          <Route path="/complete-page" element={<CreatePageForm />} />
          <Route element={<RequireUserPage />}>
            <Route
              path="/connect-withdrawal-account"
              element={<ConnectAccountForm />}
            />
          </Route>
        </Route>
      </Routes>
    </ClerkProvider>
  );
}

export default App;
