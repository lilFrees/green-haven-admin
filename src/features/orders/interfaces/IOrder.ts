export enum OrderStatus {
  pending = "pending",
  completed = "completed",
  cancelled = "cancelled",
  shipped = "shipped",
}

export interface IAdminOrder {
  order_id: string;
  user_id: string;
  user_name: string;
  total_products: number;
  total_quantity: number;
  total_amount: number;
  order_date: Date;
  order_status: OrderStatus;
}

export interface IAdminOrderWithCount {
  orders: IAdminOrder[];
  count: number;
}

export interface IAdminOrderItem {
  order_item_id: string;
  created_at: string;
  order_id: string;
  product_id: number;
  product_name: string;
  product_thumbnail: string;
  quantity: number;
  price: number;
}

export interface IOrder {
  id: string;
  created_at: Date;
  user_id: string;
  total_amount: number;
  updated_at: Date;
  order_status: OrderStatus;
}

export interface IOrderItem {
  order_item_id: string;
  created_at: Date;
  order_id: string;
  product_id: number;
  product_name: string;
  quantity: number;
  price: number;
}
