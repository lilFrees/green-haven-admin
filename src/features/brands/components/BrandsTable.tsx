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
import { IBrand } from "../interfaces/IBrand";
import BrandRow from "./BrandRow";

function BrandsTable({
  isLoading,
  brands,
}: {
  isLoading: boolean;
  brands?: IBrand[] | undefined;
}) {
  return (
    <TableContainer>
      <Table>
        <Thead>
          <Tr>
            <Th>№</Th>
            <Th>Name</Th>
            <Th>Products count</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {isLoading &&
            new Array(10).fill(0).map((_, index) => (
              <Tr key={index}>
                <Td>
                  <Skeleton className="h-[15px] w-full" />
                </Td>
                <Td>
                  <Skeleton className="h-[15px] w-full" />
                </Td>
                <Td>
                  <Skeleton className="h-[15px] w-full" />
                </Td>
                <Td>
                  <Skeleton className="h-[15px] w-full" />
                </Td>
              </Tr>
            ))}
          {!isLoading &&
            brands &&
            brands.map((brand, index) => (
              <BrandRow key={index} brand={brand} />
            ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
}

export default BrandsTable;
