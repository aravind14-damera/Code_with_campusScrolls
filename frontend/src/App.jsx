import {
    BrowserRouter,
    useLocation,
} from "react-router-dom";

import Navbar from "./components/Navbar";
import AdminNavbar from "./components/AdminNavbar";
import Footer from "./components/Footer";

import AppRoutes from "./routes/AppRoutes";


// =========================================================
// APP LAYOUT
// =========================================================

function AppLayout() {

    const location = useLocation();


    // =====================================================
    // CHECK ADMIN ROUTE
    // =====================================================

    const isAdminRoute =
        location.pathname.startsWith("/admin");


    // =====================================================
    // CHECK ADMIN LOGIN PAGE
    // =====================================================

    const isAdminLogin =
        location.pathname === "/admin/login";


    return (

        <div className="flex min-h-screen flex-col bg-white">


            {/* =================================================
                NAVIGATION
            ================================================= */}

            {isAdminLogin ? (

                // ------------------------------------------------
                // ADMIN LOGIN
                // NO NAVBAR
                // ------------------------------------------------

                null

            ) : isAdminRoute ? (

                // ------------------------------------------------
                // ADMIN PAGES
                // ADMIN NAVBAR
                // ------------------------------------------------

                <AdminNavbar />

            ) : (

                // ------------------------------------------------
                // STUDENT / PUBLIC PAGES
                // NORMAL NAVBAR
                // ------------------------------------------------

                <Navbar />

            )}


            {/* =================================================
                MAIN CONTENT
            ================================================= */}

            <main className="flex-1">

                <AppRoutes />

            </main>


            {/* =================================================
                FOOTER
            ================================================= */}

            {!isAdminLogin && (
                <Footer />
            )}

        </div>

    );

}


// =========================================================
// MAIN APP
// =========================================================

function App() {

    return (

        <BrowserRouter>

            <AppLayout />

        </BrowserRouter>

    );

}


// =========================================================
// EXPORT
// =========================================================

export default App;