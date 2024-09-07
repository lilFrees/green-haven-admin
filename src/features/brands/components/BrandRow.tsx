import { IconButton, Td, Tooltip, Tr } from "@chakra-ui/react";
import { IBrand } from "../interfaces/IBrand";
import { FaTrashAlt } from "react-icons/fa";
import { MdEdit } from "react-icons/md";

function BrandRow({ brand }: { brand: IBrand }) {
  return (
    <Tr>
      <Td>{brand.id}</Td>
      <Td>
        <span tabIndex={0}>
          <Tooltip hasArrow label={brand.name} aria-label="brand-name">
            {brand.name}
          </Tooltip>
        </span>
      </Td>
      <Td>{brand.productsCount}</Td>
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

export default BrandRow;
