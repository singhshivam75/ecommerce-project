import api from "./api";
import { Product } from "@/src/types/product";
import { products as localProducts } from "@/src/data/products";

export const ProductsAPI = {
  getAll: async (filters?: {
    search?: string;
    brand?: string;
    minPrice?: number;
    maxPrice?: number;
  }): Promise<Product[]> => {
    try {
      const params = new URLSearchParams();

      if (filters?.search) params.append("search", filters.search);
      if (filters?.brand) params.append("brand", filters.brand);
      if (filters?.minPrice) params.append("minPrice", String(filters.minPrice));
      if (filters?.maxPrice) params.append("maxPrice", String(filters.maxPrice));

      const res = await api.get(`/products?${params.toString()}`);
      if (Array.isArray(res.data)) return res.data;
      if (res.data && Array.isArray(res.data.products)) return res.data.products;
      return localProducts;
    } catch (err) {
      return localProducts;
    }
  },

  getById: async (id: string | number): Promise<Product | undefined> => {
    if (!id) {
      throw new Error("Invalid product id");
    }

    try {
      const res = await api.get(`/products/${id}`);
      if (res.data) return res.data;
    } catch (err) {
      // fallthrough to local lookup
    }

    // fallback to local products by matching id as string
    const strId = String(id);
    return localProducts.find((p) => p.id === strId);
  },
};