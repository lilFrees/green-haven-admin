export interface IUser {
  user_id: string;
  created_at: Date;
  user_email: string;
  user_name: string;
  total_orders: number;
  total_spent: number;
  favorite_items_count: number;
  last_order_date: Date | null;
  updated_at: Date;
  role: string;
}

export interface IUserWithCount {
  users: IUser[];
  count: number;
}
