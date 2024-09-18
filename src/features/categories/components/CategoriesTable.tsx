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
import { IAdminCategory } from "../interfaces/ICategory";
import CategoryRow from "./CategoryRow";

function CategoriesTable({
  categories,
  isLoading,
}: {
  categories?: IAdminCategory[] | undefined;
  isLoading: boolean;
}) {
  return (
    <TableContainer>
      <Table size="sm" variant="striped">
        <Thead className="bg-slate-50">
          <Tr className="divide-x divide-slate-400/20">
            <Th>ID</Th>
            <Th>Name</Th>
            <Th>Products count</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        {isLoading && (
          <Tbody>
            {new Array(10).fill(0).map((_, index) => (
              <Tr key={index}>
                <Td py={2}>
                  <Skeleton className="h-[15px] w-full" />
                </Td>
                <Td py={2}>
                  <Skeleton className="h-[15px] w-full" />
                </Td>
                <Td py={2}>
                  <Skeleton className="h-[15px] w-full" />
                </Td>
                <Td py={2}>
                  <Skeleton className="h-[15px] w-full" />
                </Td>
              </Tr>
            ))}
          </Tbody>
        )}
        {!isLoading && categories && (
          <Tbody>
            {categories.map((category, index) => (
              <CategoryRow key={index} category={category} />
            ))}
          </Tbody>
        )}
      </Table>
    </TableContainer>
  );
}

export default CategoriesTable;
