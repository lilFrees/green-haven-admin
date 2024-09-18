"use server";

import { supabase } from "../../../shared/supabase/client";
import { IUserWithCount } from "../interface/IUser";

export async function getUsers({
  page,
  limit,
  searchQuery,
}: {
  page: number;
  limit: number;
  searchQuery: string;
}): Promise<IUserWithCount | null> {
  let query = supabase
    .from("admin_users")
    .select("*")
    .order("user_name", { ascending: true });

  if (searchQuery) {
    query = query.ilike("user_name", `%${searchQuery}%`);
  }

  const { data: allOrders, error: orderError } = await query;

  if (orderError) {
    throw orderError.message;
  }

  const count = allOrders.length;

  const { data, error } = await query.range(
    page * limit,
    (page + 1) * limit - 1,
  );

  if (error) {
    console.error(error.message);
    return null;
  }

  return { users: data, count };
}
