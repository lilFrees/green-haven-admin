import { useState } from "react";
import { useQuery } from "react-query";
import { useOrderFilter } from "./useOrderFilter";
import { getOrders } from "../services/order-service";

const useOrders = () => {
  const filter = useOrderFilter((state) => state);
  const [maxPages, setMaxPages] = useState<number>(0);

  const { page, limit, searchQuery, setCount } = filter;

  const { data, isLoading, isError } = useQuery({
    queryKey: ["orders", { page, limit, searchQuery }],
    queryFn: async () => {
      const data = await getOrders({ page, limit, searchQuery });
      if (!data) return;
      setCount(data.count);
      setMaxPages(Math.ceil(data.count / limit));
      return data;
    },
  });

  return {
    orders: data?.orders,
    isLoading,
    isError,
    maxPages,
    ...filter,
  };
};

export default useOrders;
