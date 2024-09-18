"use client";

import {
  Skeleton,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { IUser } from "../interface/IUser";
import UserRow from "./UserRow";

function UsersTable({
  users,
  isLoading,
}: {
  users?: IUser[] | undefined;
  isLoading?: boolean | undefined;
}) {
  return (
    <TableContainer>
      <Table size="sm" variant="striped">
        <Thead className="bg-slate-50">
          <Tr className="divide-x divide-slate-400/20">
            <Th>Email</Th>
            <Th>Name</Th>
            <Th>Role</Th>
            <Th>Total Orders</Th>
            <Th>Total Spent</Th>
            <Th>Last Order Date</Th>
            <Th>Joined At</Th>
            <Th>Actions</Th>
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
