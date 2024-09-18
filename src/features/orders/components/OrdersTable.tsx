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
import { IAdminOrder } from "../interfaces/IOrder";
import OrderRow from "./OrderRow";

function OrdersTable({
  orders,
  isLoading,
}: {
  orders?: IAdminOrder[] | undefined;
  isLoading?: boolean;
}) {
  return (
    <TableContainer>
      <Table size="sm">
        <Thead className="bg-slate-50">
          <Tr className="divide-x divide-slate-400/20">
            <Th>User name</Th>
            <Th>Status</Th>
            <Th>Products count</Th>
            <Th>Quantiy</Th>
            <Th>Total amount</Th>
            <Th>Date</Th>
          </Tr>
        </Thead>
        {isLoading && (
          <Tbody>
            {new Array(10).fill(0).map((_, index) => (
              <Tr key={index}>
                {new Array(6).fill(0).map((_, index) => (
                  <Td key={index} py={2}>
                    <Skeleton className="h-[15px] w-full" />
                  </Td>
                ))}
              </Tr>
            ))}
          </Tbody>
        )}
        {!isLoading && orders && (
          <Tbody>
            {orders.map((order, index) => (
              <OrderRow key={index} order={order} />
            ))}
          </Tbody>
        )}
      </Table>
    </TableContainer>
  );
}

export default OrdersTable;
