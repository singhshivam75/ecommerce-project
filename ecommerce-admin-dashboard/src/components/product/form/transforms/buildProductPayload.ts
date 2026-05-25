import { ProductFormValues } from '../productSchema';
import { sanitizePayload } from '../../../../utils/sanitizePayload';

type Options = { forUpdate?: boolean };

export function buildProductPayload(values: ProductFormValues, opts: Options = {}) {
  // Only include fields the backend expects on create. Images, slug and internal flags are managed separately.
  const categoryIdRaw = (values as any).subCategoryId && (values as any).subCategoryId !== ''
    ? (values as any).subCategoryId
    : (values as any).categoryId;
  const categoryId = categoryIdRaw || undefined;

  // Convert value to number or undefined
  const toNumberOrNull = (v: any) => {
    if (v === undefined || v === null || v === '') return undefined;
    const n = typeof v === 'number' ? v : Number(v);
    return Number.isFinite(n) ? n : undefined;
  };

  // Only include core product fields the backend expects. Do NOT include images, variants, specifications or inventory fields here.
  const payload: any = {
    title: values.title,
    brand: values.brand || undefined,
    description: values.description || undefined,
    shortDescription: values.shortDescription || undefined,
    categoryId: categoryId,
    tags: (values.tags && values.tags.length) ? values.tags : undefined,

    // pricing - only basePrice allowed here
    basePrice: (() => {
      const v = (values as any).basePrice;
      if (v === undefined || v === null || v === '') return undefined;
      const n = typeof v === 'number' ? v : Number(v);
      return Number.isFinite(n) ? n : undefined;
    })(),
    discountType: (values as any).discountType ?? undefined,
    discountValue: (() => {
      const v = (values as any).discountValue;
      if (v === undefined || v === null || v === '') return undefined;
      const n = typeof v === 'number' ? v : Number(v);
      return Number.isFinite(n) ? n : undefined;
    })(),
    saleStartDate: (values as any).saleStartDate ?? undefined,
    saleEndDate: (values as any).saleEndDate ?? undefined,

    // SEO
    seoTitle: values.seoTitle || undefined,
    seoDescription: values.seoDescription || undefined,
    metaKeywords: values.metaKeywords || undefined,
    searchKeywords: (values as any).searchKeywords || undefined,

    // shipping
    weight: toNumberOrNull((values as any).weight),
    length: (values as any).length ?? undefined,
    width: (values as any).width ?? undefined,
    height: (values as any).height ?? undefined,
    shippingClass: (values as any).shippingClass || undefined,
    countryOfOrigin: (values as any).countryOfOrigin || undefined,

    warranty: values.warranty || undefined,
    returnPolicy: values.returnPolicy || undefined,

    // flags & status
    isFeatured: !!(values as any).featured,
    isNewArrival: !!(values as any).isNewArrival,
    status: values.status,
  };

  // On update allow some fields that are managed server-side; on create we avoid sending images, slug, featured, isActive, specifications, variants
  // Do NOT include images, variants, specifications, inventory or price fields here even on update.
  // Slug is managed server-side and can be omitted from the payload; keep update payload minimal.

  // Sanitize payload (remove undefined/invalid values, empty strings, NaN)
  // Ensure keywords are arrays (schema preprocess helps, but coerce defensively), trim & unique
  const normalizeKeywords = (v: any) => {
    if (!v) return undefined;
    let arr: string[] = [];
    if (Array.isArray(v)) arr = v.filter(Boolean).map((s: any) => String(s).trim());
    else arr = String(v).split(',').map((s: string) => s.trim()).filter(Boolean);
    // unique
    arr = Array.from(new Set(arr));
    return arr.length ? arr : undefined;
  };
  (payload as any).metaKeywords = normalizeKeywords((payload as any).metaKeywords);
  (payload as any).searchKeywords = normalizeKeywords((payload as any).searchKeywords);

  // Convert dimensions to numbers if present (backend expects numbers or null)
  (payload as any).length = toNumberOrNull((payload as any).length);
  (payload as any).width = toNumberOrNull((payload as any).width);
  (payload as any).height = toNumberOrNull((payload as any).height);

  const cleaned = sanitizePayload(payload) || {};
  // Ensure we don't send an empty or falsy subCategoryId to backend (prevents UUID validation errors)
  if ((cleaned as any).subCategoryId === '' || (cleaned as any).subCategoryId === undefined || (cleaned as any).subCategoryId === null) {
    delete (cleaned as any).subCategoryId;
  }
  return cleaned;
}
