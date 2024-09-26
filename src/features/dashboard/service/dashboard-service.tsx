import { supabase } from "../../../shared/supabase/client";
import { IBrandSale, ICategorySale, ISale } from "../interfaces/ISales";

export async function getSalesByTime({
  period,
}: {
  period: "week" | "month" | "year";
}): Promise<ISale[] | null> {
  const timeFilter = {
    week: new Date(new Date().setDate(new Date().getDate() - 7)).toISOString(),
    month: new Date(
      new Date().setMonth(new Date().getMonth() - 1),
    ).toISOString(),
    year: new Date(
      new Date().setFullYear(new Date().getFullYear() - 1),
    ).toISOString(),
  };

  const { data, error } = await supabase
    .from("orders")
    .select("id,total_amount,created_at,order_status")
    .eq("order_status", "completed")
    .gte("created_at", timeFilter[period]);

  if (error) {
    console.error(error.message);
    return null;
  }

  return data as ISale[];
}

export async function getCategorySales(): Promise<ICategorySale[] | null> {
  const { data, error } = await supabase
    .from("category_sales")
    .select("*")
    .order("number_of_products_sold", { ascending: false })
    .limit(6);

  if (error) {
    console.error(error.message);
    return null;
  }

  return data as ICategorySale[];
}

export async function getBrandSales(): Promise<IBrandSale[] | null> {
  const { data, error } = await supabase
    .from("brand_sales")
    .select("*")
    .order("number_of_products_sold", { ascending: false })
    .limit(6);

  if (error) {
    console.error(error.message);
    return null;
  }

  return data as IBrandSale[];
}
