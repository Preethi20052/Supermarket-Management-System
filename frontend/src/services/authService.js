import axios from "axios";

const API_URL = "http://localhost:8081/api/auth";

const signup = (userData) => {
    return axios.post(API_URL + "/signup", userData);
};

const login = (credentials) => {
    return axios.post(API_URL + "/login", credentials)
        .then(response => {
            if (response.data) {
                localStorage.setItem("user", JSON.stringify(response.data));
            }
            return response;
        });
};

const logout = () => {
    localStorage.removeItem("user");
};

const authService = {
    signup,
    login,
    logout,
};

export default authService;
