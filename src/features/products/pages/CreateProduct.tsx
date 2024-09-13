import { IconButton, Spinner } from "@chakra-ui/react";
import { Suspense } from "react";
import { FaChevronLeft } from "react-icons/fa6";
import { Link } from "react-router-dom";
import CreateForm from "../components/Create/CreateForm";

function CreateProduct() {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-10">
        <Link to="/products">
          <IconButton aria-label="Edit" icon={<FaChevronLeft />} />
        </Link>
        <h1 className="text-2xl font-bold">Create a new product</h1>
      </div>
      <div>
        <Suspense fallback={<Spinner />}>
          <CreateForm />
        </Suspense>
      </div>
    </div>
  );
}

export default CreateProduct;
