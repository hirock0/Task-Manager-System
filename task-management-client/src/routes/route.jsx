import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../pages/MainLayout/MainLayout";
import App from "../App";
import PageNotFound from "../pages/PageNotFound/PageNotFound";
import LoginPage from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import PublicRoute from "./PublicRoute";

export const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <MainLayout></MainLayout>,
      errorElement: <PageNotFound></PageNotFound>,
      children: [
        {
          path: "/",
          element: <App></App>,
        },
        {
          path: "/login",
          element: (
            <PublicRoute>
              <LoginPage></LoginPage>
            </PublicRoute>
          ),
        },
        {
          path: "/register",
          element: (
            <PublicRoute>
              <Register></Register>
            </PublicRoute>
          ),
        },
      ],
    },
  ],
  {
    future: {
      v7_fetcherPersist: true,
      v7_normalizeFormMethod: true,
      v7_partialHydration: true,
      v7_relativeSplatPath: true,
      v7_skipActionErrorRevalidation: true,
    },
  }
);
