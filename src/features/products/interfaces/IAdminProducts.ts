export interface IAdminProduct {
  product_id: number;
  created_at: Date;
  product_name: string;
  price: number;
  stock_quantity: number;
  category_id: number;
  category_name: string;
  brand_id: number;
  brand_name: string;
  product_description: string;
  is_active: boolean;
  thumbnail: string;
}
