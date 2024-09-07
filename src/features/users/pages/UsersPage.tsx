import { useEffect, useState } from "react";
import { getAllUsers } from "../services/user-service";
import { useQuery } from "react-query";
import axios from "axios";

function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  // useEffect(() => {
  //   async function fetchUsers() {
  //     const data = await getAllUsers();
  //     setUsers(data);
  //   }

  //   fetchUsers();
  // });

  const { data, isLoading, isError } = useQuery({
    queryKey: "users",
    queryFn: async () => {
      const data = axios.get("http://localhost:5000/api/getAllUsers", {
        params: {
          isAdmin: true,
        },
      });
    },
  });

  return <div className="text-3xl">Users</div>;
}

export default UsersPage;
