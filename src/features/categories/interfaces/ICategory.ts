export interface IAdminCategory {
  category_id: number;
  created_at: Date;
  category_name: string;
  category_description: string;
  category_slug: string;
  total_products: number;
  category_image: string;
}

export interface ICategoryWithCount {
  categories: IAdminCategory[];
  count: number;
}
export interface ICategory {
  id: number;
  created_at: Date;
  name: string;
  description: string;
  slug: string;
  image: string;
}
