import api from "./api";

const signup = async (userData) => {
    const response = await api.post("/auth/signup", userData);
    return response.data;
};

const login = async (userData) => {
    const response = await api.post("/auth/login", userData);

    const token = response.data.access_token;

    localStorage.setItem("token", token);

    return response.data;
};

const getCurrentUser = async () => {
    const response = await api.get("/auth/me");
    return response.data;
};

const logout = () => {
    localStorage.removeItem("token");
};

const authService = {
    signup,
    login,
    getCurrentUser,
    logout,
};

export default authService;