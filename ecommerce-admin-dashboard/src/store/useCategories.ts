import {create} from "zustand";
import { CategoriesAPI } from "@/src/lib/categories.api";

type State = {
  tree: any[];
  flat: any[];
  loading: boolean;
  error: string | null;
  fetchTree: () => Promise<void>;
  fetchFlat: () => Promise<void>;
  refresh: () => Promise<void>;
};

export const useCategories = create<State>((set, get) => ({
  tree: [],
  flat: [],
  loading: false,
  error: null,

  fetchTree: async () => {
    set({ loading: true, error: null });
    try {
      const res = await CategoriesAPI.getTree({});
      const data = res.data?.data ?? res.data ?? [];
      set({ tree: Array.isArray(data) ? data : [], loading: false });
    } catch (e: any) {
      set({ error: e?.message ?? "Failed", loading: false });
    }
  },

  fetchFlat: async () => {
    set({ loading: true, error: null });
    try {
      const res = await CategoriesAPI.getMainCategories({ page: 1, limit: 9999 });
      const data = res.data?.data ?? res.data ?? [];
      set({ flat: Array.isArray(data) ? data : [], loading: false });
    } catch (e: any) {
      set({ error: e?.message ?? "Failed", loading: false });
    }
  },

  refresh: async () => {
    await Promise.all([get().fetchTree(), get().fetchFlat()]);
  },
}));

export default useCategories;
