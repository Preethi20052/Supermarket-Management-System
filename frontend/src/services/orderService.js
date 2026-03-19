import api from "./api";

const STATS_PATH = "/admin/stats";

export const placeOrder = (payload) => api.post("/order/place", payload);

export const getOrders = () => api.get("/order");

export const cancelOrder = (id) => api.put(`/order/cancel/${id}`);

export const updateOrderStatus = (id, status) =>
  api.put(`/order/update-status/${id}?status=${status}`);

export const getDashboardStats = () => api.get(STATS_PATH);
