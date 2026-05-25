export interface ProductImage {
  id: string;
  url: string;
  alt?: string;
  isPrimary?: boolean;
  width?: number;
  height?: number;
  mimeType?: string;
  sortOrder?: number;
}

export interface ProductPricing {
  price: number;
  currency?: string;
  compareAtPrice?: number;
  discountType?: "percentage" | "fixed" | null;
  discountValue?: number | null;
  saleStartsAt?: string | null;
  saleEndsAt?: string | null;
}

export interface ProductSpecification {
  id: string;
  key: string;
  value: string;
}

export interface ProductReview {
  id: string;
  author?: string;
  rating: number;
  title?: string;
  body?: string;
  createdAt?: string;
}

export interface ProductShipping {
  weight?: number;
  width?: number;
  height?: number;
  depth?: number;
  freeShipping?: boolean;
  estimatedDelivery?: string;
}

export interface ProductVariant {
  id: string;
  sku?: string;
  title?: string;
  size?: string | null;
  color?: string | null;
  price?: number | null;
  compareAtPrice?: number | null;
  stock?: number | null;
  isDefault?: boolean;
  imageId?: string | null;
  isActive?: boolean;
  metadata?: Record<string, unknown>;
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  brand?: string | null;
  shortDescription?: string | null;
  description?: string | null;
  images?: ProductImage[];
  variants?: ProductVariant[];
  basePrice: number | string;
  pricing?: ProductPricing;
  specifications?: ProductSpecification[];
  reviews?: ProductReview[];
  rating?: number;
  totalReviews?: number;
  inventory?: {
    total?: number;
    available?: number;
    status?: string;
  };
  tags?: string[];
  isFeatured?: boolean;
  isNewArrival?: boolean;
  status?: string;
  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
  shipping?: ProductShipping;
  createdAt?: string;
  metadata?: Record<string, unknown>;
}
 