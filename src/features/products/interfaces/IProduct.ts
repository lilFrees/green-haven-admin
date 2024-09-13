export interface IProduct {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discounted_price: number;
  rating: number;
  stock: number;
  brand: string;
  sku: string;
  weight: number;
  dimensions: {
    width: number;
    height: number;
    depth: number;
  };
  warranty_information: string;
  shipping_information: string;
  return_policy: string;
  availability_status: string;
  reviews: {
    rating: number;
    comment: string;
    date: string;
    reviewerName: string;
    reviewerEmail: string;
  }[];
  images: string[];
  thumbnail: string;
  is_active: boolean;
}
