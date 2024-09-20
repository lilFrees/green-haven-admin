import { supabase } from "../../../shared/supabase/client";
import { IUser, IUserWithCount } from "../interface/IUser";

export async function getUsers({
  page,
  limit,
  searchQuery,
  sortBy,
  ascending,
}: {
  page?: number;
  limit?: number;
  searchQuery?: string;
  sortBy?: keyof IUser | undefined;
  ascending?: boolean;
}): Promise<IUserWithCount | null> {
  let query = supabase.from("admin_users").select("*");

  if (sortBy) {
    query = query.order(sortBy, { ascending });
  }

  if (searchQuery) {
    query = query.ilike("user_name", `%${searchQuery}%`);
  }

  const { data: allOrders, error: orderError } = await query;

  if (orderError) {
    throw orderError.message;
  }

  const count = allOrders.length;

  if (page === undefined || limit === undefined) {
    const { data, error } = await query;

    if (error) {
      console.error(error.message);
      return null;
    }

    return { users: data, count };
  }

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
