import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import OrdersTable from "../components/OrdersTable";
import useOrders from "../hooks/useOrders";
import ReactPaginate from "react-paginate";
import { Select } from "@chakra-ui/react";
import ErrorMessage from "../../../shared/components/ErrorMessage";

function OrdersPage() {
  const { orders, isLoading, maxPages, setPage, page, limit, setLimit } =
    useOrders();

  return (
    <div className="flex min-h-full flex-col gap-5">
      <h1 className="text-3xl">Orders {orders && `(${orders.length})`}</h1>
      {orders && orders?.length === 0 && !isLoading && (
        <ErrorMessage message="There are no orders to show" />
      )}
      <OrdersTable orders={orders} isLoading={isLoading} />

      <div className="mt-auto flex items-center justify-end gap-5">
        <ReactPaginate
          onPageChange={(e) => setPage(e.selected)}
          pageCount={maxPages}
          breakLabel={"..."}
          pageRangeDisplayed={2}
          nextLabel={
            <FaChevronRight
              className={`text-xl ${page !== maxPages - 1 ? "text-gray-700" : "text-gray-400"}`}
            />
          }
          previousLabel={
            <FaChevronLeft
              className={`text-xl ${page !== 0 ? "text-gray-700" : "text-gray-400"}`}
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

export default OrdersPage;
