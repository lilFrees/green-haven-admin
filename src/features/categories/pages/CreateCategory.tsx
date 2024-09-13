import { Link } from "react-router-dom";
import CreateCategoryForm from "../components/CreateCategoryForm";
import SingleImagePicker from "../components/SingleImagePicker";
import { IconButton } from "@chakra-ui/react";
import { FaChevronLeft } from "react-icons/fa";

function CreateCategory() {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-10">
        <Link to="/categories">
          <IconButton aria-label="Edit" icon={<FaChevronLeft />} />
        </Link>
        <h1 className="text-2xl font-bold">Create a new category</h1>
      </div>
      <div className="font-semibold">
        Category's background image (recommended)
      </div>
      <SingleImagePicker />
      <CreateCategoryForm />
    </div>
  );
}

export default CreateCategory;
