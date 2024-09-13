import { IconButton, Spinner } from "@chakra-ui/react";
import { Link, useParams } from "react-router-dom";
import { Suspense, useEffect, useState } from "react";
import { FaChevronLeft } from "react-icons/fa";
import { getProductById } from "../services/products-service";
import UpdateForm from "../components/Update/UpdateForm";
import { IProduct } from "../interfaces/IProduct";

export const fetchCache = "force-no-store";

function UpdateProduct() {
  const { productId } = useParams() as { productId: string };
  const [product, setProduct] = useState<IProduct | null>(null);
  useEffect(() => {
    async function fetchProduct() {
      const prod = await getProductById(+productId);
      setProduct(prod);
    }
    fetchProduct();
  }, [productId]);

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-10">
        <Link to="/products">
          <IconButton aria-label="Edit" icon={<FaChevronLeft />} />
        </Link>
        <h1 className="text-2xl font-bold">Edit Product Details</h1>
      </div>
      <div>
        <Suspense fallback={<Spinner />}>
          <UpdateForm product={product} />
        </Suspense>
      </div>
    </div>
  );
}

export default UpdateProduct;
