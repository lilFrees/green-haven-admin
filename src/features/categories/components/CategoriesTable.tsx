import {
  Skeleton,
  Table,
  TableContainer,
  Tbody,
  Th,
  Thead,
  Tr,
  Td,
} from "@chakra-ui/react";
import useCategories from "../hooks/useCategories";
import { ICategory } from "../interfaces/ICategory";
import CategoryRow from "./CategoryRow";
import { LazyLoadComponent } from "react-lazy-load-image-component";

function CategoriesTable({
  categories,
  isLoading,
}: {
  categories: ICategory[];
  isLoading: boolean;
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
            categories.map((category, index) => (
              <CategoryRow key={index} category={category} />
            ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
}

export default CategoriesTable;
