"use client";

import { useQuery } from "react-query";
import { getUsers } from "../services/user-service";
import {
  Skeleton,
  Table,
  TableContainer,
  Tbody,
  Td,
  Thead,
  Tr,
} from "@chakra-ui/react";
import UserRow from "./UserRow";
import { IUser } from "../interface/IUser";

function UsersTable({
  users,
  isLoading,
}: {
  users?: IUser[] | undefined;
  isLoading?: boolean | undefined;
}) {
  return (
    <TableContainer>
      <Table size="sm">
        <Thead>
          <Tr>
            <Td>Email</Td>
            <Td>Name</Td>
            <Td>Role</Td>
            <Td>Total Orders</Td>
            <Td>Total Spent</Td>
            <Td>Last Order Date</Td>
            <Td>Joined At</Td>
            <Td>More</Td>
          </Tr>
        </Thead>
        {isLoading && (
          <Tbody className="">
            {new Array(10).fill(0).map((_, index) => (
              <Tr key={index}>
                {new Array(8).fill(0).map((_, index) => (
                  <Td key={index}>
                    <Skeleton className="h-[15px] w-full" />
                  </Td>
                ))}
              </Tr>
            ))}
          </Tbody>
        )}
        {users && !isLoading && (
          <Tbody className="relative divide-y">
            {users?.map((user) => <UserRow user={user} key={user.user_id} />)}
          </Tbody>
        )}
      </Table>
    </TableContainer>
  );
}

export default UsersTable;
