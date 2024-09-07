import { supabase } from "../../auth/services/supabase";
import { IBrand, IBrandWithCount } from "../interfaces/IBrand";

export async function getBrands({
  page,
  limit,
  searchQuery,
}: {
  page: number;
  limit: number;
  searchQuery?: string;
}): Promise<IBrandWithCount> {
  let query = supabase
    .from("brands")
    .select("id, name")
    .order("id", { ascending: true });

  if (searchQuery) {
    query = query.or(`name.ilike.%${searchQuery}%`);
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

  const dataWithCount: IBrand[] = await Promise.all(
    data!.map(async (brand) => {
      const { data: prodCount, error: prodCountError } = await supabase
        .from("brand_products")
        .select("product_id, brand_id")
        .eq("brand_id", brand.id);

      if (prodCountError) {
        throw new Error(prodCountError.message);
      }

      return {
        ...brand,
        productsCount: prodCount.length,
      };
    }),
  );

  if (error) {
    throw new Error(error.message);
  }

  return { brands: dataWithCount, count };
}
