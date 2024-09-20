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
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import OptionsList from "../../../../shared/components/OptionsList";
import { supabase } from "../../../../shared/supabase/client";
import { convertToWebp } from "../../../../shared/utils/convertToWebp";
import { IBrand } from "../../../brands/interfaces/IBrand";
import { ICategory } from "../../../categories/interfaces/ICategory";
import { useUpdateImageStore } from "../../hooks/useUpdateImageStore";
import { IProduct } from "../../interfaces/IProduct";
import {
  getBrandsByName,
  getCategoriesByName,
} from "../../services/products-service";
import ImagePicker from "./ImagePicker";

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
  category: z.string(),
  brand: z.string(),
  stock: z.number().int().positive(),
  sku: z.string().min(3, "SKU must be at least 3 characters long"),
  warranty: z.string().min(3, "Warranty must be at least 3 characters long"),
  shippingInfo: z
    .string()
    .min(3, "Shipping Info must be at least 3 characters long"),
  returnPolicy: z.string(),
  isActive: z.boolean(),
});

type FormData = z.infer<typeof schema>;

function UpdateForm({ product }: { product: IProduct }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });
  const [category, setCategory] = useState<ICategory | null>(null);
  const [brand, setBrand] = useState<IBrand | null>(null);
  const toast = useToast();
  const navigate = useNavigate();
  const { images } = useUpdateImageStore();

  const watchedCategory = watch("category") || "";
  const watchedBrand = watch("brand") || "";

  useEffect(() => {
    async function getInfo() {
      const { data: categ, error: categoryError } = await supabase
        .from("categories")
        .select("*")
        .eq("slug", product.category)
        .single();

      const { data: brandData, error: brandError } = await supabase
        .from("brands")
        .select("*")
        .eq("name", product.brand)
        .single();

      if (categoryError || brandError) {
        throw new Error("Failed to fetch category or brand");
      }

      setCategory(categ);
      setValue("category", categ?.name);
      setBrand(brandData);
      setValue("brand", brandData?.name);
    }

    getInfo();
  }, [product.brand, product.category, setValue]);

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

  const onSubmit = async (formData: FormData) => {
    const { data: existingImages, error: listError } = await supabase.storage
      .from("product_images")
      .list(`product-id-${product.id}`);

    if (listError) {
      throw listError.message;
    }

    const convertedImg = await Promise.all(
      images.map(async (image, i) => {
        const compressedImage = await convertToWebp(image.file, 100);

        const { error } = await supabase.storage
          .from("product_images")
          .upload(`product-id-${product.id}/image-${i}.webp`, compressedImage, {
            upsert: true,
            cacheControl: "0",
          });

        if (error) throw error.message;

        const {
          data: { publicUrl },
        } = supabase.storage
          .from("product_images")
          .getPublicUrl(`product-id-${product.id}/image-${i}.webp`);

        return publicUrl;
      }),
    );

    const { error } = await supabase
      .from("products")
      .update({
        title: formData.title,
        description: formData.description,
        price: formData.price,
        discounted_price: formData.discount,
        stock: formData.stock,
        sku: formData.sku,
        warranty_information: formData.warranty,
        category: category?.slug,
        brand: brand?.name,
        shipping_information: formData.shippingInfo,
        return_policy: formData.returnPolicy,
        is_active: formData.isActive,
        thumbnail: convertedImg.length > 0 ? convertedImg[0] : "",
        images: convertedImg,
      })
      .eq("id", product.id)
      .single();

    const existingImagePaths = existingImages.map(
      (item) => `product-id-${product.id}/${item.name}`,
    );
    const uploadedImagePaths = convertedImg.map((url) =>
      url.split("/").slice(-2).join("/"),
    );

    const imagesToDelete = existingImagePaths.filter(
      (path) => !uploadedImagePaths.includes(path),
    );

    if (imagesToDelete.length > 0) {
      const { error: deleteError } = await supabase.storage
        .from("product_images")
        .remove(imagesToDelete);

      if (deleteError) {
        throw deleteError.message;
      }
    }

    if (error) throw error.message;

    toast({
      title: "Product Updated",
      description: "Product details have been updated successfully",
      status: "success",
      duration: 5000,
      isClosable: true,
    });

    navigate("/products");
  };

  return (
    <form className="flex flex-col gap-10" onSubmit={handleSubmit(onSubmit)}>
      <ImagePicker initialImages={product.images} />
      <div className="container grid grid-cols-[repeat(auto-fit,minmax(1fr,20rem))] gap-5 *:h-full *:w-full">
        {/* Title */}
        <FormControl isInvalid={!!errors.title}>
          <FormLabel htmlFor="title">Title</FormLabel>
          <Input
            id="title"
            defaultValue={product.title}
            {...register("title")}
          />
          <FormErrorMessage>{errors.title?.message}</FormErrorMessage>
        </FormControl>

        {/* Price */}
        <FormControl isInvalid={!!errors.price}>
          <FormLabel htmlFor="price">Price</FormLabel>
          <NumberInput defaultValue={product.price}>
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
          <NumberInput defaultValue={product.discounted_price}>
            <NumberInputField id="discount" {...register("discount")} />
          </NumberInput>
          <FormErrorMessage>{errors.discount?.message}</FormErrorMessage>
        </FormControl>

        {/* Stock */}
        <FormControl isInvalid={!!errors.stock}>
          <FormLabel htmlFor="stock">Stock</FormLabel>
          <NumberInput defaultValue={product.stock}>
            <NumberInputField
              id="stock"
              {...register("stock", { valueAsNumber: true })}
            />
          </NumberInput>
          <FormErrorMessage>{errors.stock?.message}</FormErrorMessage>
        </FormControl>

        {/* SKU */}
        <FormControl isInvalid={!!errors.sku} className="w-full">
          <FormLabel
            htmlFor="sku"
            className="!flex w-full items-center justify-between"
          >
            <div>SKU</div>
            <Button
              size="sm"
              variant="ghost"
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
          <Input id="sku" defaultValue={product.sku} {...register("sku")} />
          <FormErrorMessage>{errors.sku?.message}</FormErrorMessage>
        </FormControl>

        {/* Warranty */}
        <FormControl isInvalid={!!errors.warranty}>
          <FormLabel htmlFor="warranty">Warranty</FormLabel>
          <Input
            id="warranty"
            defaultValue={product.warranty_information}
            {...register("warranty")}
          />
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
          <Input
            id="shippingInfo"
            defaultValue={product.shipping_information}
            {...register("shippingInfo")}
          />
          <FormErrorMessage>{errors.shippingInfo?.message}</FormErrorMessage>
        </FormControl>

        {/* Return Policy */}
        <FormControl isInvalid={!!errors.returnPolicy}>
          <FormLabel htmlFor="returnPolicy">Return Policy</FormLabel>
          <Input
            id="returnPolicy"
            defaultValue={product.return_policy}
            {...register("returnPolicy")}
          />
          <FormErrorMessage>{errors.returnPolicy?.message}</FormErrorMessage>
        </FormControl>

        {/* Description */}
        <FormControl isInvalid={!!errors.description} className="col-span-2">
          <FormLabel htmlFor="description">Description</FormLabel>
          <Textarea
            id="description"
            defaultValue={product.description}
            {...register("description")}
          />
          <FormErrorMessage>{errors.description?.message}</FormErrorMessage>
        </FormControl>

        {/* Is Active */}
        <div className="col-span-3 mt-5 flex items-center justify-between">
          <FormControl display="flex" alignItems="center">
            <Switch
              colorScheme="green"
              id="isActive"
              defaultChecked={product.is_active}
              {...register("isActive")}
            />
            <FormLabel htmlFor="isActive" ml={5} mb="0">
              Is Active?
            </FormLabel>
          </FormControl>

          <Button type="submit" isLoading={isSubmitting} colorScheme="green">
            Update
          </Button>
        </div>
      </div>
    </form>
  );
}

export default UpdateForm;
