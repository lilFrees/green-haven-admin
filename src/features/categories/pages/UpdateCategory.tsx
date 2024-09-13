import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { getCategoryById } from "../services/category-service";
import UpdateCategoryForm from "../components/UpdateCategoryForm";
import SingleImagePicker from "../components/SingleImagePicker";

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

  if (!isLoading) {
    console.log(category);
  }

  return (
    <div>
      <SingleImagePicker />
      <UpdateCategoryForm category={category} isLoading={isLoading} />
    </div>
  );
}

export default UpdateCategory;
