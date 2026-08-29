import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const AdminLogin = () => {

    const navigate = useNavigate();

    const { login } = useContext(AuthContext);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);


    // =========================================================
    // ADMIN LOGIN
    // =========================================================

    const handleLogin = async (e) => {

        e.preventDefault();

        setError("");
        setLoading(true);

        try {

            // Login using existing authentication API
            const response = await login(
                email,
                password
            );

            const loggedInUser = response.user;


            // =================================================
            // CHECK ADMIN ROLE
            // =================================================

            if (loggedInUser.role !== "admin") {

                // Remove student session
                localStorage.removeItem("access_token");
                localStorage.removeItem("user");

                throw new Error(
                    "You are not authorized to access the admin panel."
                );
            }


            // =================================================
            // ADMIN LOGIN SUCCESS
            // =================================================

            navigate("/admin");

        } catch (err) {

            console.error(
                "Admin login error:",
                err
            );

            if (err.response?.data?.detail) {

                setError(
                    err.response.data.detail
                );

            } else {

                setError(
                    err.message ||
                    "Invalid admin credentials."
                );
            }

        } finally {

            setLoading(false);

        }
    };


    return (

        <div className="min-h-[calc(100vh-5rem)] bg-slate-50 flex items-center justify-center px-6">

            <div className="w-full max-w-md">


                {/* =================================================
                    HEADER
                ================================================= */}

                <div className="text-center mb-8">

                    <h1 className="text-3xl font-bold text-slate-900">
                        Admin Login
                    </h1>

                    <p className="mt-2 text-slate-500">
                        Sign in to manage Campus Scrolls
                    </p>

                </div>


                {/* =================================================
                    LOGIN CARD
                ================================================= */}

                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-8">

                    <form
                        onSubmit={handleLogin}
                        className="space-y-5"
                    >


                        {/* =================================================
                            EMAIL
                        ================================================= */}

                        <div>

                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Email
                            </label>

                            <input
                                type="email"
                                value={email}
                                onChange={(e) =>
                                    setEmail(e.target.value)
                                }
                                placeholder="admin@example.com"
                                required

                                className="
                                    w-full
                                    rounded-lg
                                    border
                                    border-slate-300
                                    bg-white
                                    px-4
                                    py-3
                                    text-slate-900
                                    placeholder-slate-400
                                    outline-none
                                    focus:border-blue-500
                                    focus:ring-2
                                    focus:ring-blue-100
                                "
                            />

                        </div>


                        {/* =================================================
                            PASSWORD
                        ================================================= */}

                        <div>

                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Password
                            </label>

                            <input
                                type="password"
                                value={password}
                                onChange={(e) =>
                                    setPassword(e.target.value)
                                }
                                placeholder="Enter your password"
                                required

                                className="
                                    w-full
                                    rounded-lg
                                    border
                                    border-slate-300
                                    bg-white
                                    px-4
                                    py-3
                                    text-slate-900
                                    placeholder-slate-400
                                    outline-none
                                    focus:border-blue-500
                                    focus:ring-2
                                    focus:ring-blue-100
                                "
                            />

                        </div>


                        {/* =================================================
                            ERROR
                        ================================================= */}

                        {error && (

                            <div className="
                                rounded-lg
                                border
                                border-red-200
                                bg-red-50
                                px-4
                                py-3
                                text-sm
                                text-red-600
                            ">

                                {error}

                            </div>

                        )}


                        {/* =================================================
                            LOGIN BUTTON
                        ================================================= */}

                        <button
                            type="submit"
                            disabled={loading}

                            className="
                                w-full
                                rounded-lg
                                bg-blue-600
                                px-5
                                py-3
                                font-medium
                                text-white
                                transition
                                hover:bg-blue-700
                                disabled:cursor-not-allowed
                                disabled:opacity-60
                            "
                        >

                            {loading
                                ? "Signing in..."
                                : "Admin Login"
                            }

                        </button>

                    </form>

                </div>

            </div>

        </div>
    );
};

export default AdminLogin;