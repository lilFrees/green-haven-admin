export interface IAdminBrand {
  brand_id: number;
  brand_name: string;
  total_products: number;
  image: string;
}

export interface IBrandWithCount {
  brands: IAdminBrand[];
  count: number;
}

export interface IBrand {
  id: number;
  name: string;
  slug: string;
  image: string;
  created_at: Date;
}
