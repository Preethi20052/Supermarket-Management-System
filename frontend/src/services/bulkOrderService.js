import api from "./api";

export const getSocietyBulkDeals = (societyId) => {
    return api.get(`/bulk-orders/society/${societyId}`);
};

export const joinBulkDeal = (bulkOrderId, quantity) => {
    return api.post("/bulk-orders/join", { bulkOrderId, quantity });
};

export const updateContribution = (bulkOrderId, quantity) => {
    return api.put("/bulk-orders/update", { bulkOrderId, quantity });
};

export const leaveBulkDeal = (bulkOrderId) => {
    return api.delete(`/bulk-orders/leave?bulkOrderId=${bulkOrderId}`);
};

export const getParticipants = (bulkOrderId) => {
    return api.get(`/bulk-orders/participants/${bulkOrderId}`);
};
