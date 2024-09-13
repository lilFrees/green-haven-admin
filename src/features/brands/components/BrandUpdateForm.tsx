import { z } from "zod";
import { IBrand } from "../interfaces/IBrand";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import { generateSlug } from "../../../shared/utils/generateSlug";
import { supabase } from "../../../shared/supabase/client";
import { convertToWebp } from "../../../shared/utils/convertToWebp";
import { useBrandImage } from "../hooks/useBrandImage";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { remove } from "lodash";

const schema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
});

type BrandData = z.infer<typeof schema>;

function BrandUpdateForm({
  brand,
  isLoading,
}: {
  brand?: IBrand | undefined;
  isLoading: boolean;
}) {
  const {
    handleSubmit,
    register,
    setValue,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<BrandData>({
    resolver: zodResolver(schema),
  });

  const { image, removeImage } = useBrandImage();
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    return removeImage;
  }, [removeImage]);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-5">
        <Spinner />
        <div className="text-xl">Loading data...</div>
      </div>
    );
  }

  function slugGenerator() {
    const name = getValues("name");
    const slug = generateSlug(name);
    setValue("slug", slug);
  }

  async function onSubmit(data: BrandData) {
    const { data: updatedData, error: udpateError } = await supabase
      .from("brands")
      .update({
        name: data.name,
        slug: data.slug,
      })
      .eq("id", brand?.id)
      .select("*")
      .single();

    if (udpateError) {
      toast({
        title: "Error updating brand",
        status: "error",
        isClosable: true,
        duration: 5000,
        description: udpateError.message,
      });
      throw new Error(udpateError?.message);
    }

    if (!image) throw new Error("Please upload an image");

    const compressedImage = await convertToWebp(image.file);

    const { error: imageError } = await supabase.storage
      .from("brand_logos")
      .upload(`${updatedData.slug}/logo.webp`, compressedImage, {
        upsert: true,
        cacheControl: "0",
      });

    if (imageError) {
      toast({
        title: "Error uploading image",
        status: "error",
        isClosable: true,
        duration: 5000,
      });
      throw new Error(imageError.message);
    }

    const {
      data: { publicUrl },
    } = supabase.storage
      .from("brand_logos")
      .getPublicUrl(`${updatedData.slug}/logo.webp`);

    const { error: updateImageError } = await supabase
      .from("brands")
      .update({ image: publicUrl })
      .eq("id", updatedData.id);

    if (updateImageError) {
      toast({
        title: "Error updating image",
        status: "error",
        isClosable: true,
        duration: 5000,
      });
      throw new Error(updateImageError.message);
    }

    toast({
      title: "Brand updated",
      status: "success",
      isClosable: true,
      duration: 5000,
    });

    navigate("/brands");
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      <FormControl isInvalid={!!errors.name}>
        <FormLabel htmlFor="brand">Brand's Name</FormLabel>
        <Input id="brand" defaultValue={brand?.name} {...register("name")} />
        <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
      </FormControl>
      <FormControl isInvalid={!!errors.slug}>
        <FormLabel
          htmlFor="slug"
          className="!flex items-center justify-between"
        >
          <div>Slug</div>
          <Button variant="ghost" size="sm" onClick={slugGenerator}>
            Generate slug
          </Button>
        </FormLabel>
        <Input id="slug" defaultValue={brand?.slug} {...register("slug")} />
        <FormErrorMessage>{errors.slug?.message}</FormErrorMessage>
      </FormControl>
      <Button
        colorScheme="green"
        className="w-max"
        type="submit"
        isLoading={isSubmitting}
      >
        Update
      </Button>
    </form>
  );
}

export default BrandUpdateForm;
