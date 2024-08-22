import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Layout from "./shared/Layout.tsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import OrdersPage from "./features/orders/pages/OrdersPage.tsx";
import CategoriesPage from "./features/categories/pages/CategoriesPage.tsx";
import ProductsPage from "./features/products/pages/ProductsPage.tsx";
import ReviewsPage from "./features/reviews/pages/ReviewsPage.tsx";
import UsersPage from "./features/users/pages/UsersPage.tsx";
import DashboardPage from "./features/dashboard/pages/DashboardPage.tsx";
import BrandsPage from "./features/brands/pages/BrandsPage.tsx";
import ErrorPage from "./shared/ErrorPage.tsx";
import LoginPage from "./features/auth/pages/LoginPage.tsx";

const browserRouter = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,

    children: [
      {
        path: "/dashboard",
        element: <DashboardPage />,
      },
      {
        path: "/products",
        element: <ProductsPage />,
      },
      {
        path: "/categories",
        element: <CategoriesPage />,
      },
      {
        path: "/brands",
        element: <BrandsPage />,
      },
      {
        path: "/users",
        element: <UsersPage />,
      },
      {
        path: "/orders",
        element: <OrdersPage />,
      },
      {
        path: "/reviews",
        element: <ReviewsPage />,
      },
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ChakraProvider>
      <RouterProvider router={browserRouter} />
    </ChakraProvider>
  </StrictMode>,
);