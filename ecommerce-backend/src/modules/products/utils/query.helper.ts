import { SelectQueryBuilder } from 'typeorm';
import { Product } from '../entities/product.entity';

export function applyProductFilters(qb: SelectQueryBuilder<Product>, filters: any) {
  const { search, categoryId, brand, color, size, minPrice, maxPrice } = filters;

  if (search) {
    qb.andWhere(
      '(product.title ILIKE :search OR product.description ILIKE :search OR product.brand ILIKE :search OR variant.sku ILIKE :search)',
      { search: `%${search}%` },
    );
  }

  if (categoryId) qb.andWhere('product.categoryId = :categoryId', { categoryId });
  if (brand) qb.andWhere('product.brand ILIKE :brand', { brand: `%${brand}%` });
  if (color) qb.andWhere('variant.color ILIKE :color', { color: `%${color}%` });
  if (size) qb.andWhere('variant.size ILIKE :size', { size: `%${size}%` });

  if (minPrice) qb.andWhere('variant.price >= :minPrice', { minPrice });
  if (maxPrice) qb.andWhere('variant.price <= :maxPrice', { maxPrice });

  return qb;
}
