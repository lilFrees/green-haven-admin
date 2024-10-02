import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  useToast,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { useBrandImage } from "../hooks/useBrandImage";
import { supabase } from "../../../shared/supabase/client";
import { generateSlug } from "../../../shared/utils/generateSlug";
import { convertToWebp } from "../../../shared/utils/convertToWebp";
import { useNavigate } from "react-router-dom";

const schema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
});

type BrandData = z.infer<typeof schema>;

function BrandCreateForm() {
  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<BrandData>({
    resolver: zodResolver(schema),
  });

  const toast = useToast();
  const navigate = useNavigate();
  const { removeImage, image } = useBrandImage();

  useEffect(() => {
    return removeImage;
  }, [removeImage]);

  function slugGenerator() {
    const name = getValues("name");
    const slug = generateSlug(name);
    setValue("slug", slug);
  }

  async function onSubmit(data: BrandData) {
    if (!image) {
      toast({
        title: "Please upload an image",
        status: "error",
        description: "You need to upload the logo of the brand",
      });
      throw new Error("Please upload an image");
    }

    const compressedImage = await convertToWebp(image.file);

    const { error: imageError } = await supabase.storage
      .from("brand_logos")
      .upload(`${data.slug}/logo.webp`, compressedImage, {
        cacheControl: "3600",
        upsert: false,
      });

    if (imageError) {
      toast({
        title: "Error",
        description: imageError.message,
        status: "error",
      });
      throw new Error(imageError.message);
    }

    const {
      data: { publicUrl },
    } = supabase.storage
      .from("brand_logos")
      .getPublicUrl(`${data.slug}/logo.webp`);

    const { error: insertError } = await supabase.from("brands").insert({
      name: data.name,
      slug: data.slug,
      image: publicUrl,
    });

    if (insertError) {
      toast({
        title: "Error",
        description: insertError.message,
        status: "error",
      });
      throw new Error(insertError.message);
    }

    toast({
      title: "Brand created",
      description: "The brand has been created successfully",
      status: "success",
    });

    navigate("/brands");
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      <FormControl isInvalid={!!errors.name}>
        <FormLabel htmlFor="brand">Name of the brand</FormLabel>
        <Input {...register("name")} id="brand" />
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
        <Input id="slug" {...register("slug")} />
        <FormErrorMessage>{errors.slug?.message}</FormErrorMessage>
      </FormControl>
      <Button
        colorScheme="green"
        type="submit"
        className="w-max"
        isLoading={isSubmitting}
      >
        Create
      </Button>
    </form>
  );
}

export default BrandCreateForm;
