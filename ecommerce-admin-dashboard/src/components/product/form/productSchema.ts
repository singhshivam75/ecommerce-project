import { z } from 'zod';

export const productSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  brand: z.string().optional(),
  description: z.string().optional(),
  shortDescription: z.string().optional(),
  slug: z.string().optional(),
  basePrice: z.preprocess((v) => (v === '' ? undefined : Number(v)), z.number().min(0)),
  comparePrice: z.preprocess((v) => (v === '' ? undefined : Number(v)), z.number().optional()),
  costPrice: z.preprocess((v) => (v === '' ? undefined : Number(v)), z.number().optional()),
  discountType: z.enum(['fixed','percentage']).optional(),
  discountValue: z.preprocess((v) => (v === '' ? undefined : Number(v)), z.number().optional()),
  saleStartDate: z.preprocess((v) => {
    if (!v) return undefined;
    try {
      if (v instanceof Date) return v.toISOString();
      const parsed = new Date(v as any);
      return isNaN(parsed.getTime()) ? undefined : parsed.toISOString();
    } catch (e) {
      return undefined;
    }
  }, z.string().optional()),
  saleEndDate: z.preprocess((v) => {
    if (!v) return undefined;
    try {
      if (v instanceof Date) return v.toISOString();
      const parsed = new Date(v as any);
      return isNaN(parsed.getTime()) ? undefined : parsed.toISOString();
    } catch (e) {
      return undefined;
    }
  }, z.string().optional()),
  categoryId: z.string().uuid(),
  subCategoryId: z.preprocess(
    (val) => (val === '' ? undefined : val),
    z.string().uuid().optional()
  ),
  images: z.array(z.object({ url: z.string().optional(), alt: z.string().optional(), isPrimary: z.boolean().optional(), order: z.number().optional() })).optional(),
  tags: z.array(z.string()).optional(),
  videoUrl: z.preprocess((v) => (v === '' ? undefined : v), z.string().url().optional()),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  searchKeywords: z.preprocess((v) => {
    if (!v) return undefined;
    if (Array.isArray(v)) return v;
    if (typeof v === 'string') return (v as string).split(',').map(s => s.trim()).filter(Boolean);
    return undefined;
  }, z.array(z.string()).optional()),
  metaKeywords: z.preprocess((v) => {
    if (!v) return undefined;
    if (Array.isArray(v)) return v;
    if (typeof v === 'string') return (v as string).split(',').map(s => s.trim()).filter(Boolean);
    return undefined;
  }, z.array(z.string()).optional()),
  status: z.enum(['draft','published','archived','out_of_stock']).default('draft'),
  featured: z.boolean().optional(),
  isNewArrival: z.boolean().optional(),
  isActive: z.boolean().optional(),
  sku: z.string().optional(),
  barcode: z.string().optional(),
  stock: z.preprocess((v) => (v === '' ? undefined : Number(v)), z.number().optional()),
  lowStockThreshold: z.preprocess((v) => (v === '' ? undefined : Number(v)), z.number().optional()),
  weight: z.preprocess((v) => {
    if (v === '' || v === undefined || v === null) return undefined;
    const n = typeof v === 'number' ? v : Number(v);
    return Number.isFinite(n) ? n : v;
  }, z.number().min(0).optional()),
  // removed `dimensions` - backend expects individual `length`, `width`, `height`
  length: z.preprocess((v) => (v === '' ? undefined : Number(v)), z.number().optional()),
  width: z.preprocess((v) => (v === '' ? undefined : Number(v)), z.number().optional()),
  height: z.preprocess((v) => (v === '' ? undefined : Number(v)), z.number().optional()),
  warranty: z.string().optional(),
  returnPolicy: z.string().optional(),
  shippingClass: z.string().optional(),
  countryOfOrigin: z.string().optional(),
  specifications: z.array(z.object({ key: z.string(), value: z.string() })).optional(),
  variants: z.array(z.any()).optional(),
});

export type ProductFormValues = z.infer<typeof productSchema>;
