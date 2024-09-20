import { supabase } from "../../../shared/supabase/client";
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
    .from("admin_brands")
    .select("*")
    .order("brand_id", { ascending: true });

  if (searchQuery) {
    query = query.ilike("brand_name", `%${searchQuery}%`);
  }

  const { data: allBrands, error: errorCategories } = await query;

  if (errorCategories) {
    throw errorCategories.message;
  }

  const count = allBrands.length;

  const { data, error } = await query.range(
    page * limit,
    (page + 1) * limit - 1,
  );

  if (error) {
    throw new Error(error.message);
  }

  return { brands: data, count };
}

export async function getBrandById(brandId: number): Promise<IBrand> {
  const { data, error } = await supabase
    .from("brands")
    .select("*")
    .eq("id", brandId)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
