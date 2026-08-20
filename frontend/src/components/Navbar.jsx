import { Link, useLocation, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {

    const location = useLocation();
    const navigate = useNavigate();

    const { isAuthenticated, logout } = useContext(AuthContext);

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    // Public pages
    const publicPages = ["/", "/login", "/signup"];

    const isPublicPage = publicPages.includes(location.pathname);

    return (
        <nav className="w-full border-b border-slate-200 bg-white">

            <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">

                {/* Logo */}
                <Link
                    to="/"
                    className="text-3xl font-bold"
                >
                    <span className="text-slate-900">
                        Campus
                    </span>

                    <span className="text-blue-600">
                        Scrolls
                    </span>
                </Link>


                {/* ========================= */}
                {/* BEFORE LOGIN */}
                {/* ========================= */}

                {(!isAuthenticated || isPublicPage) && (

                    <div className="flex items-center gap-8">

                        <Link
                            to="/"
                            className="text-slate-700 hover:text-blue-600"
                        >
                            Home
                        </Link>

                        <Link
                            to="/login"
                            className="text-slate-700 hover:text-blue-600"
                        >
                            Login
                        </Link>

                        <Link
                            to="/signup"
                            className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
                        >
                            Sign Up
                        </Link>

                    </div>
                )}


                {/* ========================= */}
                {/* AFTER LOGIN */}
                {/* ========================= */}

                {isAuthenticated && !isPublicPage && (

                    <div className="flex items-center gap-8">

                        <Link
                            to="/courses"
                            className="text-slate-700 hover:text-blue-600"
                        >
                            Courses
                        </Link>

                        <Link
                            to="/profile"
                            className="text-slate-700 hover:text-blue-600"
                        >
                            Profile
                        </Link>

                        <button
                            onClick={handleLogout}
                            className="rounded-lg border border-red-200 px-5 py-3 text-red-600 hover:bg-red-50"
                        >
                            Logout
                        </button>

                    </div>
                )}

            </div>

        </nav>
    );
};

export default Navbar;