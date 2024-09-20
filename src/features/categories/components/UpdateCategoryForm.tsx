import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useCategoryImage } from "../hooks/useCategoryImage";
import { ICategory } from "../interfaces/ICategory";
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Spinner,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import { generateSlug } from "../../../shared/utils/generateSlug";
import { supabase } from "../../../shared/supabase/client";
import { convertToWebp } from "../../../shared/utils/convertToWebp";
import { useNavigate } from "react-router-dom";
const schema = z.object({
  name: z.string().min(5),
  description: z.string().min(10),
  slug: z.string().min(5),
});

type CategoryData = z.infer<typeof schema>;

function UpdateCategoryForm({
  category,
  isLoading,
}: {
  category?: ICategory | undefined;
  isLoading?: boolean;
}) {
  const { image } = useCategoryImage();
  const toast = useToast();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    getValues,
  } = useForm<CategoryData>({
    resolver: zodResolver(schema),
  });
  if (isLoading)
    return (
      <div className="flex flex-col gap-5">
        <Spinner size="sm" />
        <h2>Loading the category...</h2>
      </div>
    );

  async function onSubmit(data: CategoryData) {
    const { error: updateError } = await supabase
      .from("categories")
      .update({
        name: data.name,
        description: data.description,
        slug: data.slug,
      })
      .eq("id", category?.id)
      .single();
    if (updateError) {
      console.error(updateError.message);
      toast({
        title: "Failed to update category",
        description: updateError.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    if (image) {
      const compressedImage = await convertToWebp(image.file, 100);

      const { error: storageError } = await supabase.storage
        .from("category_images")
        .upload(`category-${data.slug}/image.webp`, compressedImage, {
          upsert: true,
          cacheControl: "0",
        });

      if (storageError) {
        console.error(storageError.message);
        toast({
          title: "Failed to upload category image",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
      }

      const {
        data: { publicUrl },
      } = supabase.storage
        .from("category_images")
        .getPublicUrl(`category-${data.slug}/image.webp`);

      const { error: imageError } = await supabase
        .from("categories")
        .update({
          image: publicUrl,
        })
        .eq("id", category?.id)
        .single();

      if (imageError) {
        console.error(imageError.message);
        toast({
          title: "Failed to update category image",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
      }
    }
    toast({
      title: "Category updated successfully",
      status: "success",
      duration: 5000,
      isClosable: true,
      position: "top",
    });
    navigate("/categories");
  }

  function generateHandler() {
    const name = getValues("name");
    const generatedSlug = generateSlug(name);
    setValue("slug", generatedSlug);
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2"
    >
      <FormControl isInvalid={!!errors.name}>
        <FormLabel htmlFor="name">Name of the category</FormLabel>
        <Input defaultValue={category?.name} {...register("name")} id="name" />
        <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={!!errors.slug}>
        <FormLabel
          htmlFor="slug"
          className="!flex w-full items-center justify-between"
        >
          <div>Slug</div>
          <Button variant="ghost" size="sm" onClick={generateHandler}>
            Generate slug
          </Button>
        </FormLabel>
        <Input defaultValue={category?.slug} {...register("slug")} id="slug" />
        <FormErrorMessage>{errors.slug?.message}</FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={!!errors.description} className="col-span-2">
        <FormLabel htmlFor="description">Description</FormLabel>
        <Textarea
          defaultValue={category?.description}
          {...register("description")}
          id="description"
        />
        <FormErrorMessage>{errors.description?.message}</FormErrorMessage>
      </FormControl>

      <Button
        type="submit"
        colorScheme="green"
        className="w-max"
        isLoading={isSubmitting}
      >
        Update
      </Button>
    </form>
  );
}

export default UpdateCategoryForm;
