import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  IconButton,
  Td,
  Tooltip,
  Tr,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { FaTrashAlt } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { IAdminCategory } from "../interfaces/ICategory";
import { Link, useNavigate } from "react-router-dom";
import { useRef } from "react";
import { supabase } from "../../../shared/supabase/client";

function CategoryRow({ category }: { category: IAdminCategory }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef<HTMLButtonElement | null>(null);
  const toast = useToast();
  const navigate = useNavigate();

  async function deleteHandler() {
    const { error } = await supabase
      .from("categories")
      .delete()
      .eq("id", category.category_id);

    if (error) {
      console.error(error.message);
      toast({
        title: "Failed to delete category",
        status: "error",
        description: error.message,
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      onClose();
    } else {
      toast({
        title: "Category deleted",
        status: "info",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      onClose();
      navigate("/categories");
    }
  }

  return (
    <Tr>
      <Td>{category.category_id}</Td>
      <Td>
        <Link to={`/categories/${category.category_id}`}>
          <span tabIndex={0}>
            <Tooltip
              hasArrow
              label={category.category_name}
              aria-label="category-name"
            >
              {category.category_name}
            </Tooltip>
          </span>
        </Link>
      </Td>
      <Td>{category.total_products}</Td>
      <Td display="flex" gap="10px">
        <Link to={`/categories/${category.category_id}`}>
          <IconButton aria-label="edit-product" icon={<MdEdit />} size="sm" />
        </Link>
        <IconButton
          aria-label="delete-product"
          icon={<FaTrashAlt />}
          colorScheme="red"
          onClick={onOpen}
          size="sm"
        />
        <AlertDialog
          isOpen={isOpen}
          leastDestructiveRef={cancelRef}
          onClose={onClose}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                Delete the category {category.category_name}?
              </AlertDialogHeader>

              <AlertDialogBody>
                Are you sure? You can't undo this action afterwards.
              </AlertDialogBody>

              <AlertDialogFooter>
                <Button ref={cancelRef} onClick={onClose}>
                  Cancel
                </Button>
                <Button colorScheme="red" onClick={deleteHandler} ml={3}>
                  Delete
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      </Td>
    </Tr>
  );
}

export default CategoryRow;
