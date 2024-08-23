import {
  Button,
  Input,
  InputGroup,
  InputRightElement,
  Select,
  Skeleton,
} from "@chakra-ui/react";
import { FaChevronLeft, FaChevronRight, FaSearch } from "react-icons/fa";
import { FaRegCircleXmark } from "react-icons/fa6";
import ReactPaginate from "react-paginate";
import { useQuery } from "react-query";
import ProductsTable from "../components/ProductsTable";
import useFilter from "../hooks/useFilter";
import { getProducts } from "../services/products-service";
import { useState } from "react";

function ProductsPage() {
  const {
    count,
    page,
    setCount,
    setPage,
    limit,
    searchQuery,
    setLimit,
    setSearchQuery,
    clearSearchQuery,
  } = useFilter((state) => state);
  const [maxPages, setMaxPages] = useState<number>(0);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["products", { page, limit, searchQuery }],
    queryFn: async () => {
      const data = await getProducts({ page, limit, searchQuery });
      console.log(data);
      setCount(data.count);
      setMaxPages(Math.ceil(data.count / limit));
      return data;
    },
  });

  const products = data?.products;

  return (
    <div className="flex flex-col gap-5">
      <h2 className="text-3xl">Products</h2>
      <Button
        onClick={() => {
          setPage(0);
        }}
      >
        Refresh
      </Button>
      <div className="flex items-center justify-between gap-5">
        <InputGroup>
          <Input
            placeholder="Search for products"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <InputRightElement>
            {searchQuery.length > 0 ? (
              <FaRegCircleXmark onClick={clearSearchQuery} />
            ) : (
              <FaSearch />
            )}
          </InputRightElement>
        </InputGroup>
        <div className="flex gap-5">
          <Button colorScheme="green" variant="outline">
            Bulk import
          </Button>
          <Button colorScheme="green">New</Button>
        </div>
      </div>
      <div className="relative">
        <ProductsTable products={products!} isLoading={isLoading} />
      </div>
      <div className="flex items-center justify-end gap-5">
        {/* PAGINATION HERE */}
        <ReactPaginate
          onPageChange={(e) => setPage(e.selected)}
          pageCount={maxPages}
          breakLabel={"..."}
          pageRangeDisplayed={5}
          nextLabel={<FaChevronRight fontSize={20} />}
          previousLabel={<FaChevronLeft fontSize={20} />}
          pageLinkClassName="px-2 py-1 border border-gray-300 rounded"
          className="flex items-center justify-end gap-2"
          activeLinkClassName="bg-green-500 text-white"
          renderOnZeroPageCount={({ pageClassName }) => (
            <div className={pageClassName}>No more pages</div>
          )}
        />
        <div className="w-20">
          <Select onChange={(e) => setLimit(+e.target.value)}>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </Select>
        </div>
      </div>
    </div>
  );
}

export default ProductsPage;
