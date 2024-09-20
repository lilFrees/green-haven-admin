import { supabase } from "../../../shared/supabase/client";
import {
  ICategory,
  ICategoryWithCount
} from "../interfaces/ICategory";

export async function getCategories({
  page,
  limit,
  searchQuery,
}: {
  page: number;
  limit: number;
  searchQuery: string;
}): Promise<ICategoryWithCount> {
  let query = supabase
    .from("admin_categories")
    .select("*")
    .order("category_id", { ascending: true });

  if (searchQuery) {
    query = query.ilike("category_name", `%${searchQuery}%`);
  }

  const { data: allCategories, error: errorCategories } = await query;

  if (errorCategories) {
    throw errorCategories.message;
  }

  const count = allCategories.length;

  const { data, error } = await query.range(
    page * limit,
    (page + 1) * limit - 1,
  );

  if (error) {
    throw new Error(error.message);
  }

  return { categories: data, count };
}

export async function getCategoryById(id: number): Promise<ICategory | null> {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error(error.message);
    return null;
  }

  return data;
}

export async function createCategory({
  image,
  name,
  slug,
  description,
}: ICategory) {
  const { data, error } = await supabase
    .from("categories")
    .insert([
      {
        name,
        slug,
        description,
        image,
      },
    ])
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
