import { IconButton, Td, Tooltip, Tr } from "@chakra-ui/react";
import { FaTrashAlt } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { ICategory } from "../interfaces/ICategory";

function CategoryRow({ category }: { category: ICategory }) {
  return (
    <Tr>
      <Td>{category.id}</Td>
      <Td>
        <span tabIndex={0}>
          <Tooltip hasArrow label={category.name} aria-label="category-name">
            {category.name}
          </Tooltip>
        </span>
      </Td>
      <Td>{category.productsCount}</Td>
      <Td display="flex" gap="10px">
        <IconButton aria-label="edit-product" icon={<MdEdit />} size="sm" />
        <IconButton
          aria-label="delete-product"
          icon={<FaTrashAlt />}
          colorScheme="red"
          size="sm"
        />
      </Td>
    </Tr>
  );
}

export default CategoryRow;
