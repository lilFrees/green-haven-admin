import { IconButton, Td, Tooltip, Tr } from "@chakra-ui/react";
import { FaTrashAlt } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { IAdminBrand } from "../interfaces/IBrand";

function BrandRow({ brand }: { brand: IAdminBrand }) {
  return (
    <Tr>
      <Td>{brand.brand_id}</Td>
      <Td>
        <span tabIndex={0}>
          <Tooltip hasArrow label={brand.brand_name} aria-label="brand-name">
            {brand.brand_name}
          </Tooltip>
        </span>
      </Td>
      <Td>{brand.total_products}</Td>
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
