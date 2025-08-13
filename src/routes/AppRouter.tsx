import { createBrowserRouter } from "react-router-dom";
import { RedirectIfAuth } from "../components/route-guards";
import { AuthLayout, ProtectedLayout } from "../components/layouts";
import {
  LoginPageWrapper,
  ForgotPasswordWrapper,
  ResetPasswordWrapper
} from "../components/route-wrappers";
import { RootRedirect, NotFound } from "../components/route-utils";
import { Dashboard, Announcement, Business, Library, Program } from "../pages";

const router = createBrowserRouter([
  {
    path: "/",
    errorElement: <NotFound />,
    children: [
      // Root redirect
      {
        index: true,
        element: <RootRedirect />
      },

      // Authentication routes (public)
      {
        path: "login",
        element: (
          <AuthLayout>
            <RedirectIfAuth>
              <LoginPageWrapper />
            </RedirectIfAuth>
          </AuthLayout>
        ),
      },
      {
        path: "forgot-password",
        element: (
          <AuthLayout>
            <RedirectIfAuth>
              <ForgotPasswordWrapper />
            </RedirectIfAuth>
          </AuthLayout>
        ),
      },
      {
        path: "reset-password",
        element: (
          <AuthLayout>
            <RedirectIfAuth>
              <ResetPasswordWrapper />
            </RedirectIfAuth>
          </AuthLayout>
        ),
      },

      // Protected routes (require authentication)
      {
        path: "dashboard",
        element: (
          <ProtectedLayout>
            <Dashboard />
          </ProtectedLayout>
        ),
      },
      {
        path: "announcements",
        element: (
          <ProtectedLayout>
            <Announcement />
          </ProtectedLayout>
        ),
      },
      {
        path: "business",
        element: (
          <ProtectedLayout>
            <Business />
          </ProtectedLayout>
        ),
      },
      {
        path: "library", 
        element: (
          <ProtectedLayout>
            <Library />
          </ProtectedLayout>
        ),
      },
      {
        path: "program",
        element: (
          <ProtectedLayout>
            <Program />
          </ProtectedLayout>
        ),
      },
      // Uncomment when you create these pages
      // {
      //   path: "settings",
      //   element: (
      //     <ProtectedLayout>
      //       <Settings />
      //     </ProtectedLayout>
      //   ),
      // },

      // Catch-all route for 404s (MUST be last)
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);

export default router;