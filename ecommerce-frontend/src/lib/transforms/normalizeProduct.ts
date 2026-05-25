import type { Product, ProductImage, ProductVariant, ProductPricing } from "@/src/types/product";

function toImage(raw: any): ProductImage {
  return {
    id: String(raw.id ?? raw._id ?? raw.url ?? Math.random()),
    url: String(raw.url ?? raw.src ?? raw.image ?? ""),
    alt: raw.alt ?? raw.title ?? undefined,
    isPrimary: Boolean(raw.isPrimary ?? raw.primary ?? false),
    width: raw.width ? Number(raw.width) : undefined,
    height: raw.height ? Number(raw.height) : undefined,
    mimeType: raw.mimeType ?? raw.type ?? undefined,
  };
}

function toVariant(raw: any): ProductVariant {
  return {
    id: String(raw.id ?? raw._id ?? raw.sku ?? Math.random()),
    sku: raw.sku ?? raw.id ?? undefined,
    title: raw.title ?? raw.name ?? undefined,
    size: raw.size ?? null,
    color: raw.color ?? null,
    price: raw.price === undefined ? undefined : Number(raw.price),
    compareAtPrice: raw.compareAtPrice === undefined ? null : Number(raw.compareAtPrice),
    stock: raw.stock === undefined ? undefined : Number(raw.stock),
    isDefault: Boolean(raw.isDefault ?? raw.default ?? false),
    imageId: raw.imageId ?? raw.image_id ?? null,
    metadata: raw.metadata ?? {},
  };
}

function toPricing(raw: any): ProductPricing | undefined {
  if (!raw) return undefined;
  const p: ProductPricing = {
    price: Number(raw.price ?? raw.basePrice ?? 0),
    currency: raw.currency ?? "INR",
    compareAtPrice: raw.compareAtPrice === undefined ? undefined : Number(raw.compareAtPrice),
    discountType: raw.discountType ?? null,
    discountValue: raw.discountValue ?? null,
    saleStartsAt: raw.saleStartsAt ?? null,
    saleEndsAt: raw.saleEndsAt ?? null,
  };
  return p;
}

export function normalizeProduct(raw: any): Product {
  const images = Array.isArray(raw.images) ? raw.images.map(toImage) : [];
  const variants = Array.isArray(raw.variants) ? raw.variants.map(toVariant) : [];

  const pricing = toPricing(raw.pricing ?? raw.price ?? raw.pricingInfo ?? {});

  const basePrice = pricing?.price ?? variants[0]?.price ?? Number(raw.basePrice ?? raw.price ?? 0);

  return {
    id: String(raw.id ?? raw._id ?? raw.sku ?? Math.random()),
    title: raw.title ?? raw.name ?? "",
    slug: raw.slug ?? raw.handle ?? String(raw.id ?? raw._id ?? ""),
    brand: raw.brand ?? raw.manufacturer ?? null,
    shortDescription: raw.shortDescription ?? raw.summary ?? null,
    description: raw.description ?? raw.longDescription ?? null,
    images,
    variants,
    basePrice,
    pricing,
    specifications: Array.isArray(raw.specifications) ? raw.specifications.map((s: any) => ({ id: String(s.id ?? s.key), key: s.key ?? s.name, value: s.value ?? String(s) })) : [],
    reviews: Array.isArray(raw.reviews) ? raw.reviews.map((r: any) => ({ id: String(r.id ?? r._id), author: r.author, rating: Number(r.rating ?? 0), title: r.title, body: r.body, createdAt: r.createdAt })) : [],
    rating: raw.averageRating ?? raw.rating ?? undefined,
    totalReviews: raw.totalReviews ?? raw.reviewsCount ?? undefined,
    inventory: raw.inventory ?? { total: raw.totalInventory ?? undefined, available: raw.available ?? undefined, status: raw.status ?? undefined },
    tags: Array.isArray(raw.tags) ? raw.tags.map(String) : [],
    isFeatured: Boolean(raw.isFeatured ?? raw.featured ?? false),
    isNewArrival: Boolean(raw.isNewArrival ?? raw.newArrival ?? false),
    status: raw.status ?? raw.state ?? undefined,
    seo: { title: raw.seoTitle ?? raw.metaTitle ?? undefined, description: raw.seoDescription ?? raw.metaDescription ?? undefined, keywords: raw.metaKeywords ?? undefined },
    shipping: raw.shipping ?? undefined,
    createdAt: raw.createdAt ?? raw.created_at ?? undefined,
    metadata: raw.metadata ?? {},
  };
}
