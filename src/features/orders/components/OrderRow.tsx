import { Badge, Td, Tr } from "@chakra-ui/react";
import { IAdminOrder, OrderStatus } from "../interfaces/IOrder";
import { formatDateString } from "../../../shared/utils/formatDateString";
import { Link } from "react-router-dom";

function OrderRow({ order }: { order: IAdminOrder }) {
  const date = formatDateString(order.order_date);

  const statusColor: Record<string, string> = {
    [OrderStatus.pending]: "orange",
    [OrderStatus.completed]: "green",
    [OrderStatus.cancelled]: "red",
    [OrderStatus.shipped]: "blue",
  };

  const badgeColor = statusColor[OrderStatus[order.order_status]];

  return (
    <Tr>
      <Td className="w-36 overflow-hidden truncate border">
        <Link to={`/orders/${order.order_id}`}>{order.user_name}</Link>
      </Td>
      <Td>
        <Badge colorScheme={badgeColor}>{order.order_status}</Badge>
      </Td>
      <Td>{order.total_products}</Td>
      <Td>{order.total_quantity}</Td>
      <Td className="font-semibold">${order.total_amount.toFixed(2)}</Td>
      <Td>{date}</Td>
    </Tr>
  );
}

export default OrderRow;
