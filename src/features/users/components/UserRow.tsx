"use client";

import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Badge,
  Button,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Td,
  Tooltip,
  Tr,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { BsThreeDots } from "react-icons/bs";
import { formatDateString } from "../../../shared/utils/formatDateString";
import { IUser } from "../interface/IUser";
import { useRef } from "react";
import { supabase } from "../../../shared/supabase/client";

function UserRow({ user }: { user: IUser }) {
  const date = formatDateString(user.created_at);
  const lastOrderDate = formatDateString(user.last_order_date);
  const { isOpen, onClose, onOpen } = useDisclosure();
  const cancelRef = useRef<HTMLButtonElement | null>(null);
  const toast = useToast();

  const roleColor =
    user.role === "admin" ? "red" : user.role === "user" ? "green" : "cyan";

  async function handleDeleteUser() {
    const { data, error } = await supabase.rpc("delete_user", {
      p_user_id: user.user_id,
    });

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }

    toast({
      title: "User deleted",
      description: "User has been deleted successfully",
      status: "success",
      duration: 5000,
      isClosable: true,
    });

    console.log(data, error);

    onClose();
    window.location.reload();
  }

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
            size="sm"
            as={IconButton}
            colorScheme="green"
            variant="ghost"
            icon={<BsThreeDots />}
            aria-label="More actions"
          />
          <MenuList>
            <MenuItem onClick={onOpen}>Delete</MenuItem>
          </MenuList>
        </Menu>
      </Td>
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Customer
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure? You can't undo this action afterwards.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleDeleteUser} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Tr>
  );
}

export default UserRow;
