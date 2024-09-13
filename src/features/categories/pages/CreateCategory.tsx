import CreateCategoryForm from "../components/CreateCategoryForm";
import SingleImagePicker from "../components/SingleImagePicker";

function CreateCategory() {
  return (
    <div>
      <h1>Create category</h1>
      <SingleImagePicker />
      <CreateCategoryForm />
    </div>
  );
}

export default CreateCategory;
