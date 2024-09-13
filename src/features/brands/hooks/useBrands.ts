import { useState } from "react";
import { useQuery } from "react-query";

import { getBrands } from "../services/brand-service";
import { useBrandFilter } from "./useBrandFilter";

const useBrands = () => {
  const filter = useBrandFilter((state) => state);
  const [maxPages, setMaxPages] = useState<number>(0);

  const { page, limit, searchQuery, setCount } = filter;

  const { data, isLoading, isError } = useQuery({
    queryKey: ["categories", { page, limit, searchQuery }],
    queryFn: async () => {
      const data = await getBrands({ page, limit, searchQuery });
      setCount(data.count);
      setMaxPages(Math.ceil(data.count / limit));
      return data;
    },
  });

  return {
    brands: data?.brands,
    isLoading,
    isError,
    maxPages,
    ...filter,
  };
};

export default useBrands;
