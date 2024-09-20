import { useQueries } from "react-query";
import { getUsers } from "../../users/services/user-service";
import {
  getBrandSales,
  getCategorySales,
  getSalesByTime,
} from "../service/dashboard-service";
import { useSalesTimeFilter } from "./useSalesTimeFilter";
import { getProducts } from "../../products/services/products-service";

export function useDashboard() {
  const { dateFilter } = useSalesTimeFilter();
  const [
    { data: orders, isLoading: ordersLoading },
    { data: users, isLoading: usersLoading },
    { data: products, isLoading: productsLoading },
    { data: categorySales, isLoading: categorySalesLoading },
    { data: brandSales, isLoading: brandSalesLoading },
  ] = useQueries([
    {
      queryKey: ["orders", dateFilter],
      queryFn: async () => {
        const result = await getSalesByTime({ period: dateFilter });
        if (result) {
          return result;
        }
      },
    },
    {
      queryKey: ["users"],
      queryFn: async () => {
        const res = await getUsers({
          limit: 5,
          page: 0,
          sortBy: "created_at",
          ascending: false,
        });
        if (res) return res.users;
      },
    },
    {
      queryKey: ["products"],
      queryFn: async () => {
        const res = await getProducts({
          page: 0,
          limit: 5,
          sortBy: "created_at",
          ascending: false,
        });
        if (res) return res.products;
      },
    },
    {
      queryKey: ["categorySales"],
      queryFn: async () => {
        const res = await getCategorySales();
        if (res) return res;
      },
    },
    {
      queryKey: ["brandSales"],
      queryFn: async () => {
        const res = await getBrandSales();
        if (res) return res;
      },
    },
  ]);

  return {
    orders,
    users,
    ordersLoading,
    usersLoading,
    products,
    productsLoading,
    categorySales,
    categorySalesLoading,
    brandSales,
    brandSalesLoading,
  };
}
