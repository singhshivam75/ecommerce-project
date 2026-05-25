export type VariantOptionGroup = {
  id: string;
  name: string;
  values: string[];
};

export type VariantOption = {
  group: string;
  value: string;
};

export type VariantCombination = {
  id?: string;
  sku?: string;
  attributes: Record<string, string>;
  price?: number;
  compareAtPrice?: number;
  stock?: number;
  reservedStock?: number;
  isActive?: boolean;
  isDefault?: boolean;
  barcode?: string;
  costPrice?: number;
  thumbnail?: string;
  productId?: string;
};
