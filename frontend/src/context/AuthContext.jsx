import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const AuthContext = createContext(null);

const API_URL = "http://localhost:8000";

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    // =====================================================
    // LOAD EXISTING LOGIN SESSION
    // =====================================================

    useEffect(() => {

        const storedToken = localStorage.getItem("access_token");
        const storedUser = localStorage.getItem("user");

        if (storedToken) {
            setToken(storedToken);
        }

        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (error) {
                console.error("Invalid stored user:", error);
                localStorage.removeItem("user");
            }
        }

        setLoading(false);

    }, []);


    // =====================================================
    // LOGIN
    // =====================================================

    const login = async (email, password) => {

        const response = await axios.post(
            `${API_URL}/auth/login`,
            {
                email,
                password,
            }
        );

        const {
            access_token,
            user: loggedInUser,
        } = response.data;

        localStorage.setItem(
            "access_token",
            access_token
        );

        localStorage.setItem(
            "user",
            JSON.stringify(loggedInUser)
        );

        setToken(access_token);
        setUser(loggedInUser);

        return response.data;
    };


    // =====================================================
    // LOGOUT
    // =====================================================

    const logout = () => {

        localStorage.removeItem("access_token");
        localStorage.removeItem("user");

        setToken(null);
        setUser(null);
    };


    // =====================================================
    // CHECK AUTHENTICATION
    // =====================================================

    const isAuthenticated = !!token;


    // =====================================================
    // CONTEXT
    // =====================================================

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                loading,
                isAuthenticated,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};