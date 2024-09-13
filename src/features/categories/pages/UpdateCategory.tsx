import { useQuery } from "react-query";
import { Link, useParams } from "react-router-dom";
import { getCategoryById } from "../services/category-service";
import UpdateCategoryForm from "../components/UpdateCategoryForm";
import SingleImagePicker from "../components/SingleImagePicker";
import { IconButton } from "@chakra-ui/react";
import { FaChevronLeft } from "react-icons/fa";

function UpdateCategory() {
  const { categoryId } = useParams();

  const { data: category, isLoading } = useQuery({
    queryKey: ["category", categoryId],
    queryFn: async () => {
      if (!categoryId) return;
      const categ = await getCategoryById(+categoryId);

      if (!categ) throw new Error("Category not found");

      return categ;
    },
  });

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-10">
        <Link to="/categories">
          <IconButton aria-label="Edit" icon={<FaChevronLeft />} />
        </Link>
        <h1 className="text-2xl font-bold">Edit category details</h1>
      </div>
      <div className="font-semibold">Category's background image (recommended)</div>
      <SingleImagePicker initialImage={category?.image} />
      <UpdateCategoryForm category={category} isLoading={isLoading} />
    </div>
  );
}

export default UpdateCategory;
