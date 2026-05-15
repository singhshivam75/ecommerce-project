import api from "./api";
import { categories as localCategories } from "@/src/data/products";

export interface Category {
  id: string;
  name: string;
  slug?: string;
  image?: string;
}

export const CategoriesAPI = {
  getAll: async (): Promise<Category[]> => {
    try {
      const res = await api.get("/categories");
      // Accept several possible shapes from backend
      if (Array.isArray(res.data)) return res.data;
      if (res.data && Array.isArray(res.data.categories)) return res.data.categories;
      return localCategories;
    } catch (err) {
      return localCategories;
    }
  },
};