export interface IBrand {
  id: number;
  name: string;
  productsCount: number;
}

export interface IBrandWithCount {
  brands: IBrand[];
  count: number;
}
