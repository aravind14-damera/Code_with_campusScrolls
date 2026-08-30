import axios from "axios";


// =========================================================
// API URL
// =========================================================

const API_URL = import.meta.env.VITE_API_URL;


// =========================================================
// AXIOS INSTANCE
// =========================================================

const api = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});


// =========================================================
// AUTH TOKEN INTERCEPTOR
// =========================================================

api.interceptors.request.use(
    (config) => {

        const token =
            localStorage.getItem("access_token") ||
            localStorage.getItem("token");

        if (token) {
            config.headers.Authorization =
                `Bearer ${token}`;
        }

        return config;
    },

    (error) => {
        return Promise.reject(error);
    }
);


// =========================================================
// EXPORT
// =========================================================

export default api;