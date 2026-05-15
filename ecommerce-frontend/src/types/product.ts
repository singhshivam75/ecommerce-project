export interface ProductImage {
  id: number;
  url: string;
  isPrimary: boolean;
}

export interface ProductVariant {
  id: number;
  sku: string;
  price: string;
  compareAtPrice?: string;
  stock: number;
  color?: string;
  size?: string;
  image?: string;
  isDefault: boolean;
}

export interface Product {
  id: number;
  title: string;
  slug: string;
  description?: string;
  shortDescription?: string;
  brand?: string;
  basePrice: string;
  rating: number;
  totalReviews: number;
  images: ProductImage[];
  variants: ProductVariant[];
}