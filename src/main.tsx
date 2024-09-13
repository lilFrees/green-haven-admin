import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LoginPage from "./features/auth/pages/LoginPage.tsx";
import BrandsPage from "./features/brands/pages/BrandsPage.tsx";
import CategoriesPage from "./features/categories/pages/CategoriesPage.tsx";
import CreateCategory from "./features/categories/pages/CreateCategory.tsx";
import UpdateCategory from "./features/categories/pages/UpdateCategory.tsx";
import DashboardPage from "./features/dashboard/pages/DashboardPage.tsx";
import OrdersPage from "./features/orders/pages/OrdersPage.tsx";
import CreateProduct from "./features/products/pages/CreateProduct.tsx";
import ProductsPage from "./features/products/pages/ProductsPage.tsx";
import UpdateProduct from "./features/products/pages/UpdateProduct.tsx";
import UsersPage from "./features/users/pages/UsersPage.tsx";
import "./index.css";
import ErrorPage from "./shared/components/ErrorPage.tsx";
import Layout from "./shared/components/Layout.tsx";
import Providers from "./shared/components/Providers.tsx";
import UpdateBrandPage from "./features/brands/pages/UpdateBrandPage.tsx";
import CreateBrandPage from "./features/brands/pages/CreateBrandPage.tsx";

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
        path: "products/:productId",
        element: <UpdateProduct />,
      },
      {
        path: "/products/create",
        element: <CreateProduct />,
      },
      {
        path: "/categories",
        element: <CategoriesPage />,
      },
      {
        path: "/categories/:categoryId",
        element: <UpdateCategory />,
      },
      {
        path: "/categories/create",
        element: <CreateCategory />,
      },
      {
        path: "/brands",
        element: <BrandsPage />,
      },
      {
        path: "/brands/:brandId",
        element: <UpdateBrandPage />,
      },
      {
        path: "/brands/create",
        element: <CreateBrandPage />,
      },
      {
        path: "/users",
        element: <UsersPage />,
      },
      {
        path: "/orders",
        element: <OrdersPage />,
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
    <Providers>
      <RouterProvider router={browserRouter} />
    </Providers>
  </StrictMode>,
);
