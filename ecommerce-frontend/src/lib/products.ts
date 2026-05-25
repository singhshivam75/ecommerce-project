import axios from "axios";
import { Product } from "@/src/types/product";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:8000";

export type ProductFilters = {
  search?: string;
  categoryId?: string;
  brand?: string;
  color?: string;
  size?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
  sortBy?: string;
  order?: "ASC" | "DESC";
};

function buildQuery(params: ProductFilters) {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (
      value !== undefined &&
      value !== null &&
      value !== ""
    ) {
      query.append(key, String(value));
    }
  });

  return query.toString();
}

export const ProductsAPI = {
  async getAll(
    filters: ProductFilters = {}
  ): Promise<Product[]> {
    try {
      const query = buildQuery(filters);

      const url = query
        ? `${API_URL}/api/products?${query}`
        : `${API_URL}/api/products`;

      console.log("API URL:", url);

      const res = await axios.get(url);

      console.log("FULL RESPONSE:", res.data);

      // ✅ HANDLE ALL POSSIBLE STRUCTURES
      const products =
        res.data?.data ||
        res.data?.products ||
        [];

      return Array.isArray(products)
        ? products
        : [];
    } catch (error) {
      console.error(
        "GET PRODUCTS ERROR:",
        error
      );

      return [];
    }
  },
  async getBySlug(slug: string) {
    try {
      const res = await axios.get(
        `${API_URL}/api/products/${slug}`
    );

      return res.data;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
};