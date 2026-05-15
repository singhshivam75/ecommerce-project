import api from "./api";

export const CategoriesAPI = {
  // MAIN CATEGORIES
  getMainCategories: (params?: any) =>
    api.get("/categories", { params }),

  // GET TREE (nested)
  getTree: (params?: any) => api.get(`/categories/tree`, { params }),

  // ALL SUBCATEGORIES
  getAllSubCategories: (params?: any) =>
    api.get("/categories/subcategories", { params }),

  // SUBCATEGORIES OF SINGLE CATEGORY
  getSubCategoriesByCategory: (id: string | number, params?: any) =>
    api.get(`/categories/${id}/subcategories`, { params }),

  create: (data: any) => api.post("/categories", data),

  update: (id: string | number, data: any) => api.patch(`/categories/${id}`, data),

  delete: (id: string | number) => api.delete(`/categories/${id}`),

  // Reorder categories: expects { orderedIds: string[] }
  reorder: (payload: any) => api.post(`/categories/reorder`, payload),

  // Upload category image
  uploadImage: (formData: FormData) => api.post(`/categories/upload-image`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),

  // Search
  search: (q: string, params?: any) => api.get(`/categories/search`, { params: { q, ...params } }),

  getById: (id: string | number) => api.get(`/categories/${id}`),
};