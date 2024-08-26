import { supabase } from "../../auth/services/supabase";
import { ICategory, ICategoryWithCount } from "../interfaces/ICategory";

export async function getCategories({
  page,
  limit,
  searchQuery,
}: {
  page: number;
  limit: number;
  searchQuery?: string;
}): Promise<ICategoryWithCount> {
  let query = supabase
    .from("categories")
    .select("id, name, description, slug")
    .order("id", { ascending: true });

  if (searchQuery) {
    query = query.or(
      `name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%,slug.ilike.%${searchQuery}%`,
    );
  }

  const { data: allCategories, error: countError } = await query;

  if (countError) {
    throw new Error(countError.message);
  }

  const count = allCategories.length;

  const { data, error } = await query.range(
    page * limit,
    (page + 1) * limit - 1,
  );

  const dataWithCount: ICategory[] = await Promise.all(
    data!.map(async (category) => {
      const { data: prodCount, error: prodCountError } = await supabase
        .from("category_products")
        .select("product_id, category_id")
        .eq("category_id", category.id);

      if (prodCountError) {
        throw new Error(prodCountError.message);
      }

      return {
        ...category,
        productsCount: prodCount.length,
      };
    }),
  );

  if (error) {
    throw new Error(error.message);
  }

  return { categories: dataWithCount, count };
}
