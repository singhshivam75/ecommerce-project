export type VariantAttribute = {
  name: string;
  value: string;
};

export type Variant = {
  id?: string;
  sku?: string;
  barcode?: string;
  // attributes stored as an object where keys are option names
  // e.g. { Color: 'Black', Storage: '128GB' }
  attributes?: Record<string, string>;
  stock?: number;
  reservedStock?: number;
  lowStockThreshold?: number;
  allowBackOrder?: boolean;
  trackInventory?: boolean;
  price?: number;
  compareAtPrice?: number;
  costPrice?: number;
  thumbnail?: string;
  galleryUrls?: string[];
  isDefault?: boolean;
  isActive?: boolean;
  productId?: string;
};
