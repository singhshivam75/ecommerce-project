import api from "./api";

export const ProductsAPI = {
  // ======================================================
  // PRODUCTS
  // ======================================================

  getAll: (params?: any) =>
    api.get("/products", {
      params,
    }),

  getById: (id: string | number) =>
    api.get(`/products/${id}`),

  create: (data: any) =>
    api.post("/products", data),

  update: (id: string | number, data: any) =>
    api.patch(`/products/${id}`, data),

  delete: (id: string | number) =>
    api.delete(`/products/${id}`),

  toggle: (id: string | number) =>
    api.patch(`/products/${id}/toggle`),

  // ======================================================
  // VARIANTS
  // ======================================================

  addVariant: (data: any) =>
    api.post("/products/variant", data),

  updateVariant: (id: string | number, data: any) =>
    api.patch(`/products/variant/${id}`, data),

  deleteVariant: (id: string | number) =>
    api.delete(`/products/variant/${id}`),

  // ======================================================
  // IMAGES
  // ======================================================

  addImage: (data: any) =>
    api.post("/products/image", data),

  deleteImage: (id: string | number) =>
    api.delete(`/products/image/${id}`),

  // ======================================================
  // SPECIFICATIONS
  // ======================================================

  addSpecification: (data: any) =>
    api.post(
      "/products/specification",
      data
    ),

  deleteSpecification: (id: string | number) =>
    api.delete(`/products/specification/${id}`),
};