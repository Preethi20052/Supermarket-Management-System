import api from "./api";

const PATH = "/admin/notifications";

export const getNotifications = () => api.get(PATH);
export const markAsRead = (id) => api.put(`${PATH}/${id}/read`);
