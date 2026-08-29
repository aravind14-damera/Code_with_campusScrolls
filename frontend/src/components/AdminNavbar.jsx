import { Link, useLocation, useNavigate } from "react-router-dom";
import { useContext } from "react";

import AuthContext from "../context/AuthContext";


const AdminNavbar = () => {

    const location = useLocation();
    const navigate = useNavigate();

    const { logout } = useContext(AuthContext);


    const handleLogout = () => {

        // Clear authentication
        logout();

        // Go back to ADMIN login
        navigate("/admin/login", {
            replace: true
        });

    };


    return (

        <nav className="border-b border-slate-200 bg-white">

            <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">

                {/* LOGO */}

                <Link
                    to="/admin"
                    className="text-3xl font-bold text-slate-900"
                >
                    Campus<span className="text-blue-600">
                        Scrolls
                    </span>
                </Link>


                {/* ADMIN NAV */}

                <div className="flex items-center gap-8">

                    <Link
                        to="/admin"
                        className={`text-lg font-medium ${
                            location.pathname === "/admin"
                                ? "text-blue-600"
                                : "text-slate-700 hover:text-blue-600"
                        }`}
                    >
                        Dashboard
                    </Link>


                    <button
                        onClick={handleLogout}
                        className="rounded-lg border border-red-200 px-5 py-3 text-lg font-medium text-red-600 hover:bg-red-50"
                    >
                        Logout
                    </button>

                </div>

            </div>

        </nav>

    );

};


export default AdminNavbar;