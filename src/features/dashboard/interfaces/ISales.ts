import { OrderStatus } from "../../orders/interfaces/IOrder";

export interface ISale {
  id: string;
  total_amount: number;
  created_at: Date;
  order_status: OrderStatus;
}

export interface ICategorySale {
  id: string;
  created_at: Date;
  category_id: number;
  category_name: string;
  number_of_products_sold: number;
}

export interface IBrandSale {
  id: string;
  created_at: Date;
  brand_id: number;
  brand_name: string;
  number_of_products_sold: number;
}
