// src/common/utils/query-builder.util.ts

import { SelectQueryBuilder, ObjectLiteral } from 'typeorm';

interface QueryOptions {
  search?: string;
  searchFields?: string[];
  page?: number;
  limit?: number;
  sortBy?: string;
  order?: 'ASC' | 'DESC';
  allowedSortFields?: string[]; // ✅ NEW
}

export async function applyQuery<T extends ObjectLiteral>(
  qb: SelectQueryBuilder<T>,
  options: QueryOptions,
) {
  const {
    search,
    searchFields = [],
    page = 1,
    limit = 10,
    sortBy = 'id',
    order = 'DESC',
    allowedSortFields = ['id'], // ✅ default safe
  } = options;

  // 🔍 SEARCH
  if (search && searchFields.length) {
    const searchQuery = searchFields
      .map((field) => `${qb.alias}.${field} ILIKE :search`)
      .join(' OR ');

    qb.andWhere(`(${searchQuery})`, {
      search: `%${search}%`,
    });
  }

  // 🛡 SAFE SORTING
  const finalSortBy = allowedSortFields.includes(sortBy)
    ? sortBy
    : 'id';

  qb.orderBy(`${qb.alias}.${finalSortBy}`, order);

  // 📄 PAGINATION
  const take = Number(limit) || 10;
  const currentPage = Number(page) || 1;
  const skip = (currentPage - 1) * take;

  qb.take(take).skip(skip);

  const [data, total] = await qb.getManyAndCount();

  return {
    data,
    meta: {
      total,
      page: currentPage,
      limit: take,
      totalPages: Math.ceil(total / take),
    },
  };
}