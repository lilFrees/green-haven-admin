"use client";

import {
  Badge,
  Button,
  Menu,
  MenuButton,
  Td,
  Tooltip,
  Tr,
} from "@chakra-ui/react";
import { BsThreeDots } from "react-icons/bs";
import { formatDateString } from "../../../shared/utils/formatDateString";
import { IUser } from "../interface/IUser";

function UserRow({ user }: { user: IUser }) {
  const date = formatDateString(user.created_at);
  const lastOrderDate = formatDateString(user.last_order_date);

  const roleColor =
    user.role === "admin" ? "red" : user.role === "user" ? "green" : "cyan";

  return (
    <Tr>
      <Td>
        <Tooltip label={user.user_email} aria-label="User Avatar">
          <div className="w-32 overflow-hidden text-ellipsis whitespace-nowrap">
            <a href={`mailto:${user.user_email}`}>{user.user_email}</a>
          </div>
        </Tooltip>
      </Td>
      <Td>{user.user_name}</Td>
      <Td>
        <Badge colorScheme={roleColor}>{user.role}</Badge>
      </Td>
      <Td>{user.total_orders}</Td>
      <Td>${user.total_spent}</Td>
      <Td>{lastOrderDate}</Td>
      <Td>{date}</Td>
      <Td>
        <Menu>
          <MenuButton
            as={Button}
            leftIcon={<BsThreeDots />}
            aria-label="More actions"
          />
        </Menu>
      </Td>
    </Tr>
  );
}

export default UserRow;
