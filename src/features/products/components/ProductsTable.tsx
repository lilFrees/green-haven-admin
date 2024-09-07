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
import { IProduct } from "../interfaces/IProduct";
import ProductRow from "./ProductRow";
import { LazyLoadComponent } from "react-lazy-load-image-component";

function ProductTable({
  products,
  isLoading,
}: {
  products: IProduct[];
  isLoading?: boolean;
}) {
  return (
    <TableContainer width="100%" className="overflow-hidden rounded-lg">
      <Table variant="stripped" colorScheme="green" className="">
        <Thead className="bg-slate-100">
          <Tr className="divide-x divide-slate-400/20">
            <Th>№</Th>
            <Th>Image</Th>
            <Th>Name</Th>
            <Th>Price</Th>
            <Th>Brand</Th>
            <Th>Status</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        {isLoading && (
          <Tbody className="">
            {new Array(10).fill(0).map((_, index) => (
              <Tr key={index}>
                {new Array(7).fill(0).map((_, index) => (
                  <Td key={index}>
                    <Skeleton className="h-[15px] w-full" />
                  </Td>
                ))}
              </Tr>
            ))}
          </Tbody>
        )}

        {!isLoading && (
          <Tbody className="relative divide-y">
            {products?.map((product) => (
              <ProductRow product={product} key={product.id} />
            ))}
          </Tbody>
        )}
      </Table>
    </TableContainer>
  );
}

export default ProductTable;
