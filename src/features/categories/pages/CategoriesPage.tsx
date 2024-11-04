"use client";

import { twMerge } from "tailwind-merge";
import {
  Button,
  Input,
  InputGroup,
  InputRightElement,
  Select,
} from "@chakra-ui/react";
import { FaSearch, FaChevronRight, FaChevronLeft } from "react-icons/fa";
import { FaRegCircleXmark } from "react-icons/fa6";
import ReactPaginate from "react-paginate";
import useCategories from "../hooks/useCategories";
import CategoriesTable from "../components/CategoriesTable";
import { Link } from "react-router-dom";

function CategoriesPage() {
  const {
    searchQuery,
    setSearchQuery,
    clearSearchQuery,
    categories,
    isLoading,
    maxPages,
    limit,
    setLimit,
    page,
    setPage,
    count,
  } = useCategories();

  return (
    <div className="flex min-h-full flex-col gap-5">
      <h2 className="text-3xl">Categories {count > 0 && `(${count})`}</h2>
      <div className="flex items-center justify-between gap-5">
        <InputGroup>
          <Input
            placeholder="Search for categories"
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

        <Link to="/categories/create">
          <Button colorScheme="green">New</Button>
        </Link>
      </div>

      <CategoriesTable categories={categories!} isLoading={isLoading} />
      <div className="mt-auto flex items-center justify-end gap-5">
        <ReactPaginate
          onPageChange={(e) => setPage(e.selected)}
          pageCount={maxPages}
          breakLabel={"..."}
          pageRangeDisplayed={2}
          nextLabel={
            <FaChevronRight
              className={twMerge(
                "text-xl",
                page !== maxPages - 1 ? "text-gray-700" : "text-gray-400",
              )}
            />
          }
          previousLabel={
            <FaChevronLeft
              className={twMerge(
                "text-xl",
                page !== 0 ? "text-gray-700" : "text-gray-400",
              )}
            />
          }
          pageLinkClassName="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-full"
          className="mt-auto flex items-center justify-end gap-2"
          activeLinkClassName="bg-green-500 text-white"
          renderOnZeroPageCount={({ pageClassName }) => (
            <div className={pageClassName}>No pages</div>
          )}
        />
        <div className="w-30">
          <Select
            value={limit}
            onChange={(e) => setLimit(+e.target.value)}
            size="sm"
          >
            <option value="10">10 / page</option>
            <option value="20">20 / page</option>
            <option value="50">50 / page</option>
            <option value="100">100 / page</option>
          </Select>
        </div>
      </div>
    </div>
  );
}

export default CategoriesPage;
