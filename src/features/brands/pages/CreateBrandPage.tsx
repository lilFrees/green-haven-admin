import { IconButton } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import BrandCreateForm from "../components/BrandCreateForm";
import { FaChevronLeft } from "react-icons/fa";
import BrandImagePicker from "../components/BrandImagePicker";

function CreateBrandPage() {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-10">
        <Link to="/brands">
          <IconButton aria-label="Go Back to brands" icon={<FaChevronLeft />} />
        </Link>
        <h1 className="text-2xl font-bold">Create a new brand</h1>
      </div>
      <BrandImagePicker />
      <BrandCreateForm />
    </div>
  );
}

export default CreateBrandPage;
