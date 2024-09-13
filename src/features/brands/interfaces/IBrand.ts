export interface IAdminBrand {
  brand_id: number;
  brand_name: string;
  total_products: number;
}

export interface IBrandWithCount {
  brands: IAdminBrand[];
  count: number;
}

export interface IBrand {
  id: number;
  name: string;
  created_at: Date;
}
