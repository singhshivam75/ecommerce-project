import { ProductFormValues } from '../productSchema';

function asNumberOrUndefined(v: any) {
    if (v === undefined || v === null || v === '') return undefined;
    const n = typeof v === 'number' ? v : Number(v);
    return Number.isFinite(n) ? n : undefined;
}

export function mapProductToForm(product: any): Partial<ProductFormValues> {
    if (!product) return {};

    // category -> categoryId / subCategoryId
    const parentId = product.category?.parentId ?? product.category?.parent?.id ?? null;
    const isSub = parentId !== null && parentId !== undefined;

        const categoryId = (() => {
            if (isSub) {
                if (parentId && typeof parentId === 'string') return parentId;
                return parentId ? String(parentId) : '';
            }

            return product.category?.id && typeof product.category.id === 'string'
                ? product.category.id
                : '';
        })();

        const subCategoryId = isSub && product.category?.id ? String(product.category.id) : '';

    // keywords: join arrays to CSV string for form display (form accepts CSV or array)
    const metaKeywords = Array.isArray(product.metaKeywords) ? product.metaKeywords.join(', ') : product.metaKeywords ?? '';
    const searchKeywords = Array.isArray(product.searchKeywords) ? product.searchKeywords.join(', ') : product.searchKeywords ?? '';

    const images = Array.isArray(product.images) && product.images.length
        ? product.images.map((i: any, idx: number) => ({ url: i.url || '', alt: i.alt || '', isPrimary: !!i.isPrimary, order: i.sortOrder ?? i.order ?? idx }))
        : [{ url: '', isPrimary: true }];

    return {
        title: product.title ?? '',
        slug: product.slug ?? '',
        brand: product.brand ?? '',
        description: product.description ?? '',
        shortDescription: product.shortDescription ?? '',
        basePrice: asNumberOrUndefined(product.basePrice ?? product.price ?? undefined),
        comparePrice: asNumberOrUndefined(product.comparePrice ?? undefined),
        costPrice: asNumberOrUndefined(product.costPrice ?? undefined),
        discountType: product.discountType ?? undefined,
        discountValue: asNumberOrUndefined(product.discountValue ?? undefined),
        saleStartDate: product.saleStartDate ?? undefined,
        saleEndDate: product.saleEndDate ?? undefined,
        seoTitle: product.seoTitle ?? '',
        seoDescription: product.seoDescription ?? '',
        metaKeywords,
        searchKeywords,
        tags: Array.isArray(product.tags) ? product.tags : [],
        status: product.status ?? 'draft',
        featured: !!product.isFeatured || !!product.featured,
        isNewArrival: !!product.isNewArrival,
        isActive: !!product.isActive,
        sku: product.sku ?? '',
        barcode: product.barcode ?? '',
        stock: asNumberOrUndefined(product.stock ?? undefined),
        lowStockThreshold: asNumberOrUndefined(product.lowStockThreshold ?? undefined),
        weight: asNumberOrUndefined(product.weight ?? undefined),
        length: asNumberOrUndefined(product.length ?? undefined),
        width: asNumberOrUndefined(product.width ?? undefined),
        height: asNumberOrUndefined(product.height ?? undefined),
        shippingClass: product.shippingClass ?? '',
        countryOfOrigin: product.countryOfOrigin ?? '',
        warranty: product.warranty ?? '',
        returnPolicy: product.returnPolicy ?? '',
        images,
        specifications: Array.isArray(product.specifications) ? product.specifications : [],
        variants: Array.isArray(product.variants) ? product.variants : [],
        categoryId: categoryId || '',
        subCategoryId: subCategoryId || '',
    };
}

export default mapProductToForm;
