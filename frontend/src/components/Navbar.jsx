import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
    const location = useLocation();

    const isActive = (path) => {
        return location.pathname === path;
    };

    return (
        <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">

            <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">

                {/* LOGO */}
                <Link
                    to="/"
                    className="group flex items-center"
                >
                    <span className="text-2xl font-extrabold tracking-tight text-slate-900">
                        Campus
                    </span>

                    <span className="text-2xl font-extrabold tracking-tight text-blue-600 transition-colors duration-300 group-hover:text-blue-700">
                        Scrolls
                    </span>
                </Link>


                {/* NAVIGATION */}
                <nav className="flex items-center gap-2">

                    {/* HOME */}
                    <Link
                        to="/"
                        className={`
                            rounded-lg
                            px-4
                            py-2.5
                            text-sm
                            font-semibold
                            transition-all
                            duration-200
                            ${
                                isActive("/")
                                    ? "bg-blue-50 text-blue-600"
                                    : "text-slate-600 hover:bg-slate-50 hover:text-blue-600"
                            }
                        `}
                    >
                        Home
                    </Link>


                    {/* LOGIN */}
                    <Link
                        to="/login"
                        className={`
                            rounded-lg
                            px-4
                            py-2.5
                            text-sm
                            font-semibold
                            transition-all
                            duration-200
                            ${
                                isActive("/login")
                                    ? "bg-blue-50 text-blue-600"
                                    : "text-slate-600 hover:bg-slate-50 hover:text-blue-600"
                            }
                        `}
                    >
                        Login
                    </Link>


                    {/* SIGN UP */}
                    <Link
                        to="/signup"
                        className="
                            ml-2
                            rounded-xl
                            bg-blue-600
                            px-5
                            py-2.5
                            text-sm
                            font-semibold
                            text-white
                            shadow-sm
                            transition-all
                            duration-300
                            hover:-translate-y-0.5
                            hover:bg-blue-700
                            hover:shadow-lg
                            hover:shadow-blue-100
                        "
                    >
                        Sign Up
                    </Link>

                </nav>

            </div>

        </header>
    );
};

export default Navbar;