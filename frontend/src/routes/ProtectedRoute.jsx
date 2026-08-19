import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {

    const {
        isAuthenticated,
        loading
    } = useContext(AuthContext);

    // Checking authentication
    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-white">

                <div className="text-center">

                    <div
                        className="
                            mx-auto
                            h-10
                            w-10
                            animate-spin
                            rounded-full
                            border-4
                            border-slate-200
                            border-t-blue-600
                        "
                    />

                    <p className="mt-4 text-sm text-slate-500">
                        Checking authentication...
                    </p>

                </div>

            </div>
        );
    }

    // Not logged in
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Logged in
    return children;
};

export default ProtectedRoute;