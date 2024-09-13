"use client";

import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  NumberInput,
  NumberInputField,
  Switch,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import imageCompression, { Options } from "browser-image-compression";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import OptionsList from "../../../../shared/components/OptionsList";
import { supabase } from "../../../../shared/supabase/client";
import { IBrand } from "../../../brands/interfaces/IBrand";
import { ICategory } from "../../../categories/interfaces/ICategory";
import { useCreateImageStore } from "../../hooks/useCreateImageStore";
import {
  getBrandsByName,
  getCategoriesByName,
} from "../../services/products-service";
import CreateImagePicker from "./CreateImagePicker";

const schema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long"),
  description: z
    .string()
    .min(3, "Description must be at least 3 characters long"),
  price: z.number().positive(),
  discount: z.preprocess(
    (value) => (value === "" ? undefined : parseFloat(value as string)),
    z.number().nullable().optional(),
  ),
  stock: z.number().int().positive(),
  brand: z.string(),
  category: z.string(),
  sku: z.string().min(3, "SKU must be at least 3 characters long"),
  warranty: z.string().min(3, "Warranty must be at least 3 characters long"),
  shippingInfo: z
    .string()
    .min(3, "Shipping Info must be at least 3 characters long"),
  returnPolicy: z.string(),
  isActive: z.boolean(),
});

type FormData = z.infer<typeof schema>;

function CreateForm() {
  const { images } = useCreateImageStore();
  const [category, setCategory] = useState<ICategory | null>(null);
  const [brand, setBrand] = useState<IBrand | null>(null);
  const toast = useToast();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const watchedCategory = watch("category") || "";
  const watchedBrand = watch("brand") || "";

  const { data: categoriesList, isLoading: categoryLoading } = useQuery({
    queryKey: ["categories", watchedCategory],
    queryFn: async () => {
      const categories = await getCategoriesByName();
      const filteredCategories = categories.filter((cat) =>
        cat.name.toLowerCase().includes(watchedCategory.toLowerCase()),
      );

      return filteredCategories;
    },
  });

  const { data: brandList, isLoading: brandLoading } = useQuery({
    queryKey: ["brands", watchedBrand],
    queryFn: async () => {
      const brands = await getBrandsByName();
      const filteredBrands = brands.filter((cat) =>
        cat.name.toLowerCase().includes(watchedBrand.toLowerCase()),
      );

      return filteredBrands;
    },
  });

  async function onSubmit(formData: FormData) {
    const { data, error: countError } = await supabase
      .from("products")
      .select("id");

    const newProductId = data ? data.length + 1 : 1;
    if (countError) {
      throw countError.message;
    }

    const { data: existingImages, error: listError } = await supabase.storage
      .from("product_images")
      .list(`$product-id-${newProductId}`);

    if (listError) {
      toast({
        title: "Error",
        description: "Failed to list existing images.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    const { error: deleteError } = await supabase.storage
      .from("product_images")
      .remove([`product-id-${newProductId}/`]);

    if (deleteError) {
      toast({
        title: "Please try again",
        description: "Failed to delete the existing images",
        duration: 5000,
        isClosable: true,
        status: "error",
      });
      return;
    }

    if (existingImages?.length > 0) {
      const imagePathsToDelete = existingImages.map(
        (img) => `product-id-${img.name}`,
      );

      const { error: deleteError } = await supabase.storage
        .from("product_images")
        .remove(imagePathsToDelete);

      if (deleteError) {
        toast({
          title: "Error",
          description: "Failed to delete existing images.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        return;
      }
    }

    const { error: insertError } = await supabase.from("products").insert({
      id: newProductId,
      title: formData.title,
      description: formData.description,
      price: formData.price,
      category: category?.slug,
      brand: brand?.name,
      discounted_price: formData.discount,
      stock: formData.stock,
      sku: formData.sku,
      warranty_information: formData.warranty,
      shipping_information: formData.shippingInfo,
      return_policy: formData.returnPolicy,
      is_active: formData.isActive,
    });

    if (insertError) {
      toast({
        title: "Failed to create product",
        description: insertError.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    const uploadedImages = await Promise.all(
      images.map(async (image, i) => {
        const options: Options = {
          maxSizeMB: 1,
          useWebWorker: true,
          fileType: "image/webp",
        };

        const compressedImage = await imageCompression(image.file, options);

        const { error: storageError } = await supabase.storage
          .from("product_images")
          .upload(
            `product-id-${newProductId}/image-${i}.webp`,
            compressedImage,
            {
              upsert: true,
              cacheControl: "0",
            },
          );

        if (storageError) throw storageError.message;

        const {
          data: { publicUrl },
        } = supabase.storage
          .from("product_images")
          .getPublicUrl(`product-id-${newProductId}/image-${i}.webp`);

        return publicUrl;
      }),
    );

    const { data: insertData, error: updateError } = await supabase
      .from("products")
      .update({
        thumbnail: uploadedImages[0],
        images: uploadedImages,
      })
      .eq("id", newProductId)
      .select("thumbnail,images");

    if (updateError) {
      toast({
        title: "Failed to upload images",
        description: updateError.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    toast({
      title: "Product created successfully",
      description: "Product has been created successfully",
      status: "success",
      duration: 5000,
      isClosable: true,
    });

    navigate("/products");
  }

  return (
    <form className="flex flex-col gap-10" onSubmit={handleSubmit(onSubmit)}>
      <CreateImagePicker />
      <div className="container grid grid-cols-[repeat(auto-fit,minmax(1fr,20rem))] gap-5 *:h-full *:w-full">
        {/* Title */}
        <FormControl isInvalid={!!errors.title}>
          <FormLabel htmlFor="title">Title</FormLabel>
          <Input id="title" {...register("title")} />
          <FormErrorMessage>{errors.title?.message}</FormErrorMessage>
        </FormControl>

        {/* Price */}
        <FormControl isInvalid={!!errors.price}>
          <FormLabel htmlFor="price">Price</FormLabel>
          <NumberInput>
            <NumberInputField
              id="price"
              {...register("price", { valueAsNumber: true })}
            />
          </NumberInput>
          <FormErrorMessage>{errors.price?.message}</FormErrorMessage>
        </FormControl>

        {/* Discount */}
        <FormControl isInvalid={!!errors.discount}>
          <FormLabel htmlFor="discount">Discounted Price (optional)</FormLabel>
          <NumberInput>
            <NumberInputField id="discount" {...register("discount")} />
          </NumberInput>
          <FormErrorMessage>{errors.discount?.message}</FormErrorMessage>
        </FormControl>

        {/* Stock */}
        <FormControl isInvalid={!!errors.stock}>
          <FormLabel htmlFor="stock">Stock</FormLabel>
          <NumberInput>
            <NumberInputField
              id="stock"
              {...register("stock", { valueAsNumber: true })}
            />
          </NumberInput>
          <FormErrorMessage>{errors.stock?.message}</FormErrorMessage>
        </FormControl>

        {/* SKU */}
        <FormControl isInvalid={!!errors.sku}>
          <FormLabel
            htmlFor="sku"
            className="!flex w-full items-center justify-between"
          >
            <div>SKU</div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                setValue(
                  "sku",
                  Math.random().toString(36).substring(5).toUpperCase(),
                )
              }
            >
              Generate
            </Button>
          </FormLabel>
          <Input id="sku" {...register("sku")} />
          <FormErrorMessage>{errors.sku?.message}</FormErrorMessage>
        </FormControl>

        {/* Warranty */}
        <FormControl isInvalid={!!errors.warranty}>
          <FormLabel htmlFor="warranty">Warranty</FormLabel>
          <Input id="warranty" {...register("warranty")} />
          <FormErrorMessage>{errors.warranty?.message}</FormErrorMessage>
        </FormControl>

        {/* Category */}
        <FormControl isInvalid={!!errors.category}>
          <FormLabel htmlFor="category">Category</FormLabel>
          <div className="relative">
            <Input id="category" {...register("category")} className="peer" />
            <OptionsList
              onSelect={(e) => {
                setCategory(e);
                setValue("category", e.name);
              }}
              options={categoriesList}
              displayKey="name"
              isLoading={categoryLoading}
            />
          </div>

          <FormErrorMessage>{errors.category?.message}</FormErrorMessage>
        </FormControl>

        {/* Brand */}
        <FormControl isInvalid={!!errors.brand}>
          <FormLabel htmlFor="brand">Brand</FormLabel>
          <div className="relative">
            <Input id="brand" {...register("brand")} className="peer" />
            <OptionsList
              onSelect={(e) => {
                setBrand(e);
                setValue("brand", e.name);
              }}
              options={brandList}
              displayKey="name"
              isLoading={brandLoading}
            />
          </div>

          <FormErrorMessage>{errors.brand?.message}</FormErrorMessage>
        </FormControl>

        {/* Shipping Info */}
        <FormControl isInvalid={!!errors.shippingInfo}>
          <FormLabel htmlFor="shippingInfo">Shipping Info</FormLabel>
          <Input id="shippingInfo" {...register("shippingInfo")} />
          <FormErrorMessage>{errors.shippingInfo?.message}</FormErrorMessage>
        </FormControl>

        {/* Return Policy */}
        <FormControl isInvalid={!!errors.returnPolicy}>
          <FormLabel htmlFor="returnPolicy">Return Policy</FormLabel>
          <Input id="returnPolicy" {...register("returnPolicy")} />
          <FormErrorMessage>{errors.returnPolicy?.message}</FormErrorMessage>
        </FormControl>

        {/* Description */}
        <FormControl isInvalid={!!errors.description} className="col-span-2">
          <FormLabel htmlFor="description">Description</FormLabel>
          <Textarea id="description" {...register("description")} />
          <FormErrorMessage>{errors.description?.message}</FormErrorMessage>
        </FormControl>

        {/* Is Active */}
        <div className="col-span-3 mt-5 flex items-center justify-between">
          <FormControl display="flex" alignItems="center">
            <Switch
              colorScheme="green"
              id="isActive"
              {...register("isActive")}
              defaultChecked={true}
            />
            <FormLabel htmlFor="isActive" ml={5} mb="0">
              Is Active?
            </FormLabel>
          </FormControl>

          <Button type="submit" isLoading={isSubmitting} colorScheme="green">
            {isSubmitting ? "Submitting" : "Submit"}
          </Button>
        </div>
      </div>
    </form>
  );
}

export default CreateForm;
