import { IconButton, Td, Tooltip, Tr } from "@chakra-ui/react";
import { FaTrashAlt } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { IAdminCategory } from "../interfaces/ICategory";
import { Link } from "react-router-dom";

function CategoryRow({ category }: { category: IAdminCategory }) {
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
          size="sm"
        />
      </Td>
    </Tr>
  );
}

export default CategoryRow;
