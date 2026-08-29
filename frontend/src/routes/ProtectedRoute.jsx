import { Navigate, useLocation } from "react-router-dom";
import { useContext } from "react";

import AuthContext from "../context/AuthContext";


const ProtectedRoute = ({ children }) => {

    const {
        user,
        token,
        loading,
    } = useContext(AuthContext);

    const location = useLocation();


    // =========================================================
    // WAIT FOR AUTHENTICATION TO LOAD
    // =========================================================

    if (loading) {

        return (
            <div className="min-h-screen flex items-center justify-center bg-white">

                <p className="text-slate-600">
                    Loading...
                </p>

            </div>
        );

    }


    // =========================================================
    // CHECK WHETHER THIS IS AN ADMIN ROUTE
    // =========================================================

    const isAdminRoute =
        location.pathname.startsWith("/admin");


    // =========================================================
    // NOT AUTHENTICATED
    // =========================================================

    if (!token || !user) {

        // -----------------------------------------------------
        // ADMIN ROUTE
        // -----------------------------------------------------

        if (isAdminRoute) {

            return (
                <Navigate
                    to="/admin/login"
                    replace
                    state={{
                        from: location.pathname
                    }}
                />
            );

        }


        // -----------------------------------------------------
        // STUDENT ROUTE
        // -----------------------------------------------------

        return (
            <Navigate
                to="/login"
                replace
                state={{
                    from: location.pathname
                }}
            />
        );

    }


    // =========================================================
    // ADMIN ROUTE
    // USER MUST BE ADMIN
    // =========================================================

    if (isAdminRoute) {

        if (user.role !== "admin") {

            return (
                <Navigate
                    to="/admin/login"
                    replace
                />
            );

        }

    }


    // =========================================================
    // AUTHENTICATED
    // =========================================================

    return children;

};


export default ProtectedRoute;