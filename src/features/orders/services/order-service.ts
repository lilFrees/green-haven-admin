import { update } from "lodash";
import { supabase } from "../../../shared/supabase/client";
import {
  IAdminOrder,
  IAdminOrderItem,
  IAdminOrderWithCount,
} from "../interfaces/IOrder";

export async function getOrders({
  page,
  limit,
  searchQuery,
}: {
  page: number;
  limit: number;
  searchQuery: string;
}): Promise<IAdminOrderWithCount | null> {
  let query = supabase
    .from("admin_orders")
    .select("*")
    .order("order_id", { ascending: true });

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

  return { orders: data, count };
}

export async function getItemsByOrderId(
  id: string,
): Promise<IAdminOrderItem[] | null> {
  const { data, error } = await supabase
    .from("admin_order_items")
    .select("*")
    .eq("order_id", id);

  if (error) {
    console.error(error.message);
    return null;
  }

  return data;
}

export async function getOrderById(id: string): Promise<IAdminOrder | null> {
  const { data, error } = await supabase
    .from("admin_orders")
    .select("*")
    .eq("order_id", id)
    .single();

  if (error) {
    console.error(error.message);
    return null;
  }

  return data;
}

export async function updateOrder(
  id: string,
  status: string,
): Promise<boolean> {
  const { error } = await supabase
    .from("orders")
    .update({
      order_status: status,
      updated_at: new Date(),
    })
    .eq("id", id);

  if (error) {
    console.error(error.message);
    return false;
  }

  return true;
}
