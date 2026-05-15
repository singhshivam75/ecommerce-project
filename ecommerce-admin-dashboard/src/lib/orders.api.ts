import api from "./api";

export const OrdersAPI = {
  getAll: () => api.get("/orders/all"),

  updateStatus: (id: number, status: string) =>
    api.patch(`/orders/${id}/status`, { status }),
};