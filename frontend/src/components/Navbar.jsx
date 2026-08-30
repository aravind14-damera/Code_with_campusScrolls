import { Link, useLocation, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {

    const location = useLocation();
    const navigate = useNavigate();

    const { isAuthenticated, logout } = useContext(AuthContext);

    const [menuOpen, setMenuOpen] = useState(false);


    // =========================================================
    // LOGOUT
    // =========================================================

    const handleLogout = () => {

        logout();
        setMenuOpen(false);

        navigate("/");
    };


    // =========================================================
    // PUBLIC PAGES
    // =========================================================

    const publicPages = [
        "/",
        "/login",
        "/signup"
    ];

    const isPublicPage =
        publicPages.includes(location.pathname);


    // =========================================================
    // CLOSE MOBILE MENU
    // =========================================================

    const closeMenu = () => {
        setMenuOpen(false);
    };


    return (

        <nav className="
            w-full
            max-w-full
            border-b
            border-slate-200
            bg-white
            relative
            z-50
        ">

            {/* =================================================
                NAVBAR CONTAINER
            ================================================= */}

            <div className="
                mx-auto
                w-full
                max-w-7xl
                h-16
                sm:h-20
                flex
                items-center
                justify-between
                px-4
                sm:px-6
                lg:px-8
            ">


                {/* =================================================
                    LOGO
                ================================================= */}

                <Link
                    to="/"
                    onClick={closeMenu}
                    className="
                        shrink-0
                        text-2xl
                        sm:text-3xl
                        font-bold
                        whitespace-nowrap
                    "
                >

                    <span className="text-slate-900">
                        Campus
                    </span>

                    <span className="text-blue-600">
                        Scrolls
                    </span>

                </Link>


                {/* =================================================
                    DESKTOP NAVIGATION
                ================================================= */}

                <div className="
                    hidden
                    md:flex
                    items-center
                    gap-6
                    lg:gap-8
                ">


                    {/* =================================================
                        BEFORE LOGIN
                    ================================================= */}

                    {(!isAuthenticated || isPublicPage) && (

                        <>

                            <Link
                                to="/"
                                className="
                                    text-slate-700
                                    hover:text-blue-600
                                    transition-colors
                                    duration-200
                                "
                            >
                                Home
                            </Link>


                            <Link
                                to="/login"
                                className="
                                    text-slate-700
                                    hover:text-blue-600
                                    transition-colors
                                    duration-200
                                "
                            >
                                Login
                            </Link>


                            <Link
                                to="/signup"
                                className="
                                    rounded-lg
                                    bg-blue-600
                                    px-5
                                    py-2.5
                                    text-white
                                    hover:bg-blue-700
                                    transition-colors
                                    duration-200
                                    whitespace-nowrap
                                "
                            >
                                Sign Up
                            </Link>

                        </>

                    )}


                    {/* =================================================
                        AFTER LOGIN
                    ================================================= */}

                    {isAuthenticated && !isPublicPage && (

                        <>

                            <Link
                                to="/courses"
                                className="
                                    text-slate-700
                                    hover:text-blue-600
                                    transition-colors
                                    duration-200
                                "
                            >
                                Courses
                            </Link>


                            <Link
                                to="/profile"
                                className="
                                    text-slate-700
                                    hover:text-blue-600
                                    transition-colors
                                    duration-200
                                "
                            >
                                Profile
                            </Link>


                            <button
                                onClick={handleLogout}
                                className="
                                    rounded-lg
                                    border
                                    border-red-200
                                    px-5
                                    py-2.5
                                    text-red-600
                                    hover:bg-red-50
                                    transition-colors
                                    duration-200
                                    whitespace-nowrap
                                "
                            >
                                Logout
                            </button>

                        </>

                    )}

                </div>


                {/* =================================================
                    MOBILE MENU BUTTON
                ================================================= */}

                <button
                    type="button"
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="
                        md:hidden
                        flex
                        items-center
                        justify-center
                        w-10
                        h-10
                        rounded-lg
                        text-slate-700
                        hover:bg-slate-100
                        transition
                    "
                    aria-label="Toggle navigation menu"
                >

                    {menuOpen ? (

                        /* X ICON */

                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="2"
                            stroke="currentColor"
                            className="w-6 h-6"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>

                    ) : (

                        /* HAMBURGER ICON */

                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="2"
                            stroke="currentColor"
                            className="w-6 h-6"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M4 6h16M4 12h16M4 18h16"
                            />
                        </svg>

                    )}

                </button>

            </div>


            {/* =====================================================
                MOBILE MENU
            ===================================================== */}

            {menuOpen && (

                <div className="
                    md:hidden
                    w-full
                    border-t
                    border-slate-100
                    bg-white
                    shadow-sm
                ">

                    <div className="
                        px-4
                        py-4
                        space-y-2
                    ">


                        {/* =================================================
                            PUBLIC MOBILE MENU
                        ================================================= */}

                        {(!isAuthenticated || isPublicPage) && (

                            <>

                                <Link
                                    to="/"
                                    onClick={closeMenu}
                                    className="
                                        block
                                        w-full
                                        rounded-lg
                                        px-4
                                        py-3
                                        text-slate-700
                                        hover:bg-blue-50
                                        hover:text-blue-600
                                        transition
                                    "
                                >
                                    Home
                                </Link>


                                <Link
                                    to="/login"
                                    onClick={closeMenu}
                                    className="
                                        block
                                        w-full
                                        rounded-lg
                                        px-4
                                        py-3
                                        text-slate-700
                                        hover:bg-blue-50
                                        hover:text-blue-600
                                        transition
                                    "
                                >
                                    Login
                                </Link>


                                <Link
                                    to="/signup"
                                    onClick={closeMenu}
                                    className="
                                        block
                                        w-full
                                        rounded-lg
                                        bg-blue-600
                                        px-4
                                        py-3
                                        text-center
                                        text-white
                                        hover:bg-blue-700
                                        transition
                                    "
                                >
                                    Sign Up
                                </Link>

                            </>

                        )}


                        {/* =================================================
                            LOGGED-IN MOBILE MENU
                        ================================================= */}

                        {isAuthenticated && !isPublicPage && (

                            <>

                                <Link
                                    to="/courses"
                                    onClick={closeMenu}
                                    className="
                                        block
                                        w-full
                                        rounded-lg
                                        px-4
                                        py-3
                                        text-slate-700
                                        hover:bg-blue-50
                                        hover:text-blue-600
                                        transition
                                    "
                                >
                                    Courses
                                </Link>


                                <Link
                                    to="/profile"
                                    onClick={closeMenu}
                                    className="
                                        block
                                        w-full
                                        rounded-lg
                                        px-4
                                        py-3
                                        text-slate-700
                                        hover:bg-blue-50
                                        hover:text-blue-600
                                        transition
                                    "
                                >
                                    Profile
                                </Link>


                                <button
                                    onClick={handleLogout}
                                    className="
                                        block
                                        w-full
                                        rounded-lg
                                        border
                                        border-red-200
                                        px-4
                                        py-3
                                        text-red-600
                                        hover:bg-red-50
                                        transition
                                        text-left
                                    "
                                >
                                    Logout
                                </button>

                            </>

                        )}

                    </div>

                </div>

            )}

        </nav>
    );
};

export default Navbar;