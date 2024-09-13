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
import ProductRow from "./ProductRow";
import { IAdminProduct } from "../interfaces/IAdminProducts";

function ProductsTable({
  products,
  isLoading,
}: {
  products?: IAdminProduct[] | undefined;
  isLoading?: boolean;
}) {
  return (
    <TableContainer width="100%" className="overflow-hidden rounded-lg">
      <Table size="sm" variant="striped">
        <Thead className="bg-slate-50">
          <Tr className="divide-x divide-slate-400/20">
            <Th>№</Th>
            <Th>Image</Th>
            <Th>Name</Th>
            <Th>Price</Th>
            <Th>Brand</Th>
            <Th>Category</Th>
            <Th>Status</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        {isLoading && (
          <Tbody>
            {new Array(10).fill(0).map((_, index) => (
              <Tr key={index}>
                {new Array(8).fill(0).map((_, index) => (
                  <Td key={index}>
                    <Skeleton className="h-[15px] w-full" />
                  </Td>
                ))}
              </Tr>
            ))}
          </Tbody>
        )}

        {products && !isLoading && (
          <Tbody className="relative divide-y">
            {products?.map((product) => (
              <ProductRow product={product} key={product.product_id} />
            ))}
          </Tbody>
        )}
      </Table>
    </TableContainer>
  );
}

export default ProductsTable;
