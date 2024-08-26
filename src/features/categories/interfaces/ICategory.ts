export interface ICategory {
  id: number;
  name: string;
  description: string;
  slug: string;
  productsCount: number;
}

export interface ICategoryWithCount {
  categories: ICategory[];
  count: number;
}
