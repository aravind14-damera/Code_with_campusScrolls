import {
    createContext,
    useEffect,
    useState,
} from "react";

import axios from "axios";


// =========================================================
// AUTH CONTEXT
// =========================================================

export const AuthContext = createContext(null);


// =========================================================
// API URL
// =========================================================

const API_URL = "http://localhost:8000";


// =========================================================
// AUTH PROVIDER
// =========================================================

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);

    const [token, setToken] = useState(null);

    const [loading, setLoading] = useState(true);


    // =====================================================
    // LOAD SAVED LOGIN SESSION
    // =====================================================

    useEffect(() => {

        const storedToken =
            localStorage.getItem("access_token");

        const storedUser =
            localStorage.getItem("user");


        if (storedToken) {

            setToken(storedToken);

        }


        if (storedUser) {

            try {

                setUser(
                    JSON.parse(storedUser)
                );

            } catch (error) {

                console.error(
                    "Invalid stored user:",
                    error
                );

                localStorage.removeItem("user");

            }

        }


        setLoading(false);

    }, []);


    // =====================================================
    // LOGIN
    // =====================================================

    const login = async (
        email,
        password
    ) => {

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


        // Save token

        localStorage.setItem(
            "access_token",
            access_token
        );


        // Save user

        localStorage.setItem(
            "user",
            JSON.stringify(loggedInUser)
        );


        // Update React state

        setToken(access_token);

        setUser(loggedInUser);


        return response.data;

    };


    // =====================================================
    // LOGOUT
    // =====================================================

    const logout = () => {

        localStorage.removeItem(
            "access_token"
        );

        localStorage.removeItem(
            "user"
        );


        setToken(null);

        setUser(null);

    };


    // =====================================================
    // AUTHENTICATION STATUS
    // =====================================================

    const isAuthenticated =
        Boolean(token);


    // =====================================================
    // CONTEXT VALUE
    // =====================================================

    const value = {

        user,

        token,

        loading,

        isAuthenticated,

        login,

        logout,

    };


    // =====================================================
    // PROVIDER
    // =====================================================

    return (

        <AuthContext.Provider value={value}>

            {children}

        </AuthContext.Provider>

    );

};


// =========================================================
// DEFAULT EXPORT
// =========================================================

export default AuthContext;