import { SelectQueryBuilder } from 'typeorm';
import { Product } from '../entities/product.entity';

export function applyProductFilters(qb: SelectQueryBuilder<Product>, filters: any) {
  const { search, categoryId, brand, color, size, minPrice, maxPrice, tags, status, onSale, attributes, barcode } = filters;

  if (search) {
    qb.andWhere(
      '(product.title ILIKE :search OR product.description ILIKE :search OR product.brand ILIKE :search OR variant.sku ILIKE :search OR product.searchKeywords::text ILIKE :search OR product.metaKeywords::text ILIKE :search)',
      { search: `%${search}%` },
    );
  }

  if (categoryId) qb.andWhere('product.categoryId = :categoryId', { categoryId });
  if (brand) qb.andWhere('product.brand ILIKE :brand', { brand: `%${brand}%` });
  if (color) qb.andWhere('variant.color ILIKE :color', { color: `%${color}%` });
  if (size) qb.andWhere('variant.size ILIKE :size', { size: `%${size}%` });

  if (minPrice) qb.andWhere('variant.price >= :minPrice', { minPrice });
  if (maxPrice) qb.andWhere('variant.price <= :maxPrice', { maxPrice });

  if (Array.isArray(tags) && tags.length > 0) {
    qb.andWhere('product.tags && :tags', { tags });
  } else if (typeof tags === 'string' && tags.trim()) {
    qb.andWhere('product.tags && :tags', { tags: [tags] });
  }

  if (attributes && typeof attributes === 'object') {
    // attributes is expected as an object e.g. { ram: '8GB' }
    qb.andWhere('variant.attributes @> :attrs', { attrs: JSON.stringify(attributes) });
  }

  if (barcode) {
    qb.andWhere('variant.barcode = :barcode', { barcode });
  }

  if (status) qb.andWhere('product.status = :status', { status });

  if (onSale) {
    qb.andWhere('product.discountValue IS NOT NULL AND product.discountValue > 0');
    qb.andWhere('(product.saleStartDate IS NULL OR product.saleStartDate <= NOW())');
    qb.andWhere('(product.saleEndDate IS NULL OR product.saleEndDate >= NOW())');
  }

  return qb;
}
