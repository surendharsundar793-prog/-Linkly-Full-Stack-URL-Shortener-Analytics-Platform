import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8080/api/v1"
});

// Request Interceptor: Automatically attach JWT token to every API request
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response Interceptor: Handle token expiration or unauthorized access
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            // Check if not on login/register page to avoid infinite redirect loops
            if (window.location.pathname !== "/login" && window.location.pathname !== "/" && window.location.pathname !== "/register") {
                localStorage.removeItem("token");
                localStorage.removeItem("userName");
                localStorage.removeItem("userEmail");
                localStorage.removeItem("userAge");
                window.location.href = "/login";
            }
        }
        return Promise.reject(error);
    }
);

export default api;