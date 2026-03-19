
import api from "./api";

// export const getCart = () => {
//     return axios.get(API_URL);
// };
export const getCartItems = () => {
    return api.get("/cart");
};


export const addToCart = (productId, quantity) => {
    return api.post("/cart/add", { productId, quantity });
};

export const removeFromCart = (id) => {
    return api.delete(`/cart/remove/${id}`);
};

export const clearCart = () => {
    return api.delete("/cart/clear");
};
