import { useState } from "react";
import { useQuery } from "react-query";
import { useCategoryFilter } from "./useCategoryFilter";
import { getCategories } from "../services/category-service";

const useCategories = () => {
  const filter = useCategoryFilter((state) => state);
  const [maxPages, setMaxPages] = useState<number>(0);

  const { page, limit, searchQuery, setCount } = filter;

  const { data, isLoading, isError } = useQuery({
    queryKey: ["categories", { page, limit, searchQuery }],
    queryFn: async () => {
      const data = await getCategories({ page, limit, searchQuery });
      setCount(data.count);
      setMaxPages(Math.ceil(data.count / limit));
      return data;
    },
  });

  return {
    categories: data?.categories,
    isLoading,
    isError,
    maxPages,
    ...filter,
  };
};

export default useCategories;
