"use client";

import { Spinner } from "@chakra-ui/react";
import { Suspense } from "react";
import { useQuery } from "react-query";
import { getUsers } from "../services/user-service";
import UsersTable from "../components/UserTable";

function UsersPage() {
  const { data: users, isLoading } = useQuery({
    queryKey: "users",
    queryFn: async () => {
      const data = await getUsers();
      return data;
    },
  });

  return (
    <div>
      <h1>Users</h1>
      <Suspense fallback={<Spinner />}>
        <UsersTable users={users} isLoading={isLoading} />
      </Suspense>
    </div>
  );
}

export default UsersPage;
