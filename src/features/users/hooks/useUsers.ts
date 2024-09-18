import { useState } from "react";
import { useQuery } from "react-query";
import { useUsersFilter } from "./useUsersFilter";
import { getUsers } from "../services/user-service";

const useUsers = () => {
  const filter = useUsersFilter((state) => state);
  const [maxPages, setMaxPages] = useState<number>(0);

  const { page, limit, searchQuery, setCount } = filter;

  const { data, isLoading, isError } = useQuery({
    queryKey: ["users", { page, limit, searchQuery }],
    queryFn: async () => {
      const data = await getUsers({ page, limit, searchQuery });
      if (!data) return;
      setCount(data.count);
      setMaxPages(Math.ceil(data.count / limit));
      return data;
    },
  });

  return {
    users: data?.users,
    isLoading,
    isError,
    maxPages,
    ...filter,
  };
};

export default useUsers;
