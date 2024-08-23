import { IProduct } from "../../products/interfaces/IProduct";

interface Order {
  id: string;
  user_id: string;
  order_status: string;
  total_amount: number;
  created_at: string;
  updated_at: string;
}

interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price: number;
  created_at: string;
}

interface OrderItemWithProduct extends OrderItem {
  product: IProduct;
}

export interface OrderWithItems extends Order {
  items: OrderItemWithProduct[];
}
