import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import { generateSlug } from "../../../shared/utils/generateSlug";
import { useCategoryImage } from "../hooks/useCategoryImage";
import { supabase } from "../../../shared/supabase/client";
import { convertToWebp } from "../../../shared/utils/convertToWebp";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const schema = z.object({
  name: z.string().min(5),
  description: z.string().min(10),
  slug: z.string().min(5),
});

type FormData = z.infer<typeof schema>;

function CreateCategoryForm() {
  const { image, removeImage } = useCategoryImage();
  const navigate = useNavigate();
  const toast = useToast();
  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    return removeImage;
  }, [removeImage]);

  async function onSubmit(data: FormData) {
    const { data: insertData, error: insertError } = await supabase
      .from("categories")
      .insert({
        name: data.name,
        description: data.description,
        slug: data.slug,
      })
      .select("*")
      .single();

    if (insertError) {
      console.error(insertError.message);
      toast({
        title: "Failed to create category",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    }

    const { id: newId } = insertData;

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
      const { error: updateError } = await supabase
        .from("categories")
        .update({
          image: publicUrl,
        })
        .eq("id", newId)
        .single();

      if (updateError) {
        console.error(updateError.message);
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
      title: "Category created successfully",
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
      className="mt-10 grid grid-cols-[minmax(15rem,1fr)] gap-5 md:grid-cols-2"
    >
      <FormControl isInvalid={!!errors.name}>
        <FormLabel htmlFor="name">Name of the category</FormLabel>
        <Input id="name" {...register("name")} />
        <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
      </FormControl>
      <FormControl isInvalid={!!errors.slug}>
        <div className="flex items-center justify-between">
          <FormLabel htmlFor="slug">Slug</FormLabel>
          <Button variant="ghost" onClick={generateHandler} size="sm">
            Generate slug
          </Button>
        </div>
        <Input id="slug" {...register("slug")} />
        <FormErrorMessage>{errors.slug?.message}</FormErrorMessage>
      </FormControl>
      <FormControl isInvalid={!!errors.description} className="md:col-span-2">
        <FormLabel htmlFor="description">Description of the category</FormLabel>
        <Textarea id="description" {...register("description")} />
        <FormErrorMessage>{errors.description?.message}</FormErrorMessage>
      </FormControl>

      <Button
        colorScheme="green"
        type="submit"
        isLoading={isSubmitting}
        className="w-max"
      >
        Create new category
      </Button>
    </form>
  );
}

export default CreateCategoryForm;
