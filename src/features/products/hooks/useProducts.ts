import { useState } from "react";
import { useQuery } from "react-query";
import { getProducts } from "../services/products-service";
import { useProductFilter } from "./useProductFilter";

const useProducts = () => {
  const filter = useProductFilter((state) => state);
  const [maxPages, setMaxPages] = useState<number>(0);

  const { page, limit, searchQuery, setCount } = filter;

  const { data, isLoading, isError } = useQuery({
    queryKey: ["products", { page, limit, searchQuery }],
    queryFn: async () => {
      const data = await getProducts({ page, limit, searchQuery });
      if (data) {
        setCount(data.count!);
        setMaxPages(Math.ceil(data.count! / limit));
        return data;
      }
    },
  });
  const products = data?.products;

  return {
    products,
    isLoading,
    isError,
    maxPages,
    ...filter,
  };
};

export default useProducts;
