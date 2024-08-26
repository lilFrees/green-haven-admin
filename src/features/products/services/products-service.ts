import { supabase } from "../../auth/services/supabase";
import { IProduct } from "../interfaces/IProduct";

export async function getProducts({
  page,
  limit,
  searchQuery,
}: {
  page: number;
  limit: number;
  searchQuery?: string;
}): Promise<{ products: IProduct[]; count: number }> {
  let query = supabase
    .from("products")
    .select("*")
    .order("id", { ascending: true });

  if (searchQuery) {
    query = query.or(
      `title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%,category.ilike.%${searchQuery}%`,
    );
  }

  const { data: allProducts, error: countError } = await query;

  if (countError) {
    throw new Error(countError.message);
  }

  const { data, error } = await query.range(
    page * limit,
    (page + 1) * limit - 1,
  );

  if (error) {
    throw new Error(error.message);
  }

  return { products: data, count: allProducts.length };
}

export async function toggleActiveStatus(
  productId: number,
  value: boolean,
): Promise<boolean> {
  const { data, error } = await supabase
    .from("products")
    .update({ is_active: value })
    .match({ id: productId })
    .select("is_active")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data.is_active;
}
