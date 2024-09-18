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
import { IAdminBrand } from "../interfaces/IBrand";
import OrderRow from "./BrandRow";
import BrandRow from "./BrandRow";
import { useBrandFilter } from "../hooks/useBrandFilter";

function BrandsTable({
  isLoading,
  brands,
}: {
  isLoading: boolean;
  brands?: IAdminBrand[] | undefined;
}) {
  const { setAscending, setOrderBy, ascending } = useBrandFilter();

  function handleSortBy(orderBy: string) {
    setOrderBy(orderBy);
    setAscending(true);
  }

  function handleToggleSort() {
    setAscending(!ascending);
  }

  return (
    <TableContainer>
      <Table size="sm" variant="striped">
        <Thead className="bg-slate-50">
          <Tr className="divide-x divide-slate-400/20">
            <Th onClick={() => handleSortBy("id")}>№</Th>
            <Th onClick={() => handleSortBy("name")}>Name</Th>
            <Th onClick={() => handleSortBy("count")}>Products count</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        {isLoading && (
          <Tbody>
            {new Array(10).fill(0).map((_, index) => (
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
          </Tbody>
        )}

        {!isLoading && brands && (
          <Tbody>
            {brands.map((brand, index) => (
              <BrandRow key={index} brand={brand} />
            ))}
          </Tbody>
        )}
      </Table>
    </TableContainer>
  );
}

export default BrandsTable;
