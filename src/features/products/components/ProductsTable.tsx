import {
  IconButton,
  Switch,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { FaTrashAlt } from "react-icons/fa";
import { MdEdit } from "react-icons/md";

function ProductTable() {
  return (
    <TableContainer width="100%">
      <Table variant="stripped" colorScheme="green">
        <Thead>
          <Tr>
            <Th>№</Th>
            <Th>Name</Th>
            <Th>Price</Th>
            <Th>Brand</Th>
            <Th>Status</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          <Tr>
            <Td>1</Td>
            <Td>IPhone 13</Td>
            <Td>$1099.99</Td>
            <Td>Apple</Td>
            <Td>
              <Switch colorScheme="green" />
            </Td>
            <Td display="flex" gap="10px">
              <IconButton
                aria-label="edit-product"
                icon={<MdEdit />}
                size="sm"
              />
              <IconButton
                aria-label="delete-product"
                icon={<FaTrashAlt />}
                colorScheme="red"
                size="sm"
              />
            </Td>
          </Tr>
        </Tbody>
      </Table>
    </TableContainer>
  );
}

export default ProductTable;
