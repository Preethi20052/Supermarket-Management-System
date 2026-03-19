// import axios from "axios";

// const BASE_URL = "http://localhost:8081/products";

// export const getAllProducts = () => {
//   return axios.get(BASE_URL);
// };

// export const addProduct = (product) => {
//   return axios.post(BASE_URL, product);
// };

// export const updateProduct = (id, product) => {
//   return axios.put(`${BASE_URL}/${id}`, product);
// };

// export const deleteProduct = (id) => {
//   return axios.delete(`${BASE_URL}/${id}`);
// };
// import axios from "axios";

// const API_URL = "http://localhost:8081/api/products";

// export const getProducts = () => axios.get(API_URL);

// export const addProduct = (product) =>
//   axios.post(API_URL, product);

// export const updateProduct = (id, product) =>
//   axios.put(`${API_URL}/${id}`, product);

// export const deleteProduct = (id) =>
//   axios.delete(`${API_URL}/${id}`);

import api from "./api";

const PATH = "/products";

export const getProducts = () => api.get(PATH);
export const getAllProducts = () => api.get(PATH);
export const addProduct = (product) => api.post(PATH, product);
export const updateProduct = (id, product) => api.put(`${PATH}/${id}`, product);
export const deleteProduct = (id) => api.delete(`${PATH}/${id}`);


