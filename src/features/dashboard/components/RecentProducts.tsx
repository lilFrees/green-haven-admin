import { Link } from "react-router-dom";
import { formatDateString } from "../../../shared/utils/formatDateString";
import { useDashboard } from "../hooks/useDashboard";
import { Button, Tooltip } from "@chakra-ui/react";
import { FaChevronRight } from "react-icons/fa";
import { LazyLoadImage } from "react-lazy-load-image-component";

function RecentProducts() {
  const { products, productsLoading } = useDashboard();

  if (productsLoading) {
    return <div className="grow">Loading...</div>;
  }

  if (!products || products.length === 0) {
    return (
      <div className="grow text-2xl font-bold">There are no products 😔</div>
    );
  }

  return (
    <div className="grow py-10">
      <h2 className="text-xl font-bold">Recently added products</h2>
      <div className="flex flex-col divide-y">
        <div className="flex items-center gap-2 py-2">
          <div className="basis-16 font-semibold text-gray-600">Image</div>
          <div className="grow font-semibold text-gray-600">Name</div>
          <div className="basis-24 font-semibold text-gray-600">
            Total spent
          </div>
          <div className="basis-24 font-semibold text-gray-600">Joined at</div>
        </div>
        {products.map((prod, i) => (
          <Link
            to={`/products/${prod.product_id}`}
            className="transition-all duration-200 hover:bg-gray-100"
            key={prod.product_id}
          >
            <div className="flex items-center gap-2">
              <div className="h-10 basis-16">
                <LazyLoadImage
                  src={prod.thumbnail}
                  className="h-full w-full object-contain"
                  alt={"Product " + i}
                />
              </div>
              <div className="grow truncate font-semibold">
                <Tooltip label={prod.product_name} aria-label="Product name">
                  {prod.product_name}
                </Tooltip>
              </div>
              <div className="basis-24 font-semibold">
                <Tooltip
                  label={`$ ${prod.price.toFixed(2)}`}
                  aria-label="total spent"
                >
                  {`$ ${prod.price.toFixed(2)}`}
                </Tooltip>
              </div>
              <div className="basis-24 font-semibold">
                <Tooltip
                  label={formatDateString(prod.created_at, {
                    month: "long",
                  })}
                  aria-label="joined at"
                >
                  {formatDateString(prod.created_at, {
                    month: "short",
                  })}
                </Tooltip>
              </div>
            </div>
          </Link>
        ))}
      </div>
      <Link to="/products" className="mx-auto mt-5 inline-block text-center">
        <Button
          colorScheme="green"
          size="sm"
          rightIcon={<FaChevronRight size={12} />}
        >
          View all products
        </Button>
      </Link>
    </div>
  );
}

export default RecentProducts;
