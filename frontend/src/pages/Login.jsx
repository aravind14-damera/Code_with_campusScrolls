import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
    const navigate = useNavigate();

    const { login } = useContext(AuthContext);

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });

        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setLoading(true);

        try {

            await login(
                formData.email,
                formData.password
            );

            // Login successful
            navigate("/dashboard");

        } catch (error) {

            console.error("Login error:", error);

            if (error.response) {

                setError(
                    error.response.data?.detail ||
                    "Invalid email or password"
                );

            } else {

                setError(
                    "Unable to connect to the server. Please try again."
                );
            }

        } finally {

            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white text-slate-900">

            {/* =========================
                LOGIN SECTION
            ========================= */}

            <div className="
                flex
                min-h-[calc(100vh-80px)]
                items-center
                justify-center
                px-6
                py-12
            ">

                <div className="w-full max-w-md">

                    {/* =========================
                        LOGO
                    ========================= */}

                    <Link
                        to="/"
                        className="
                            mb-8
                            block
                            text-center
                            text-2xl
                            font-extrabold
                            tracking-tight
                            transition-all
                            duration-300
                            hover:scale-105
                        "
                    >
                        Campus
                        <span className="text-blue-600">
                            Scrolls
                        </span>
                    </Link>


                    {/* =========================
                        LOGIN CARD
                    ========================= */}

                    <div className="
                        rounded-3xl
                        border
                        border-slate-200
                        bg-white
                        p-8
                        shadow-xl
                        shadow-slate-200/60
                        transition-all
                        duration-300
                        hover:shadow-2xl
                    ">

                        {/* =========================
                            HEADER
                        ========================= */}

                        <div className="mb-8 text-center">

                            <h1 className="
                                text-3xl
                                font-bold
                                text-slate-900
                            ">
                                Welcome back
                            </h1>

                            <p className="
                                mt-2
                                text-slate-500
                            ">
                                Login to continue your learning journey.
                            </p>

                        </div>


                        {/* =========================
                            ERROR MESSAGE
                        ========================= */}

                        {error && (

                            <div className="
                                mb-5
                                rounded-xl
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


                        {/* =========================
                            FORM
                        ========================= */}

                        <form
                            onSubmit={handleSubmit}
                            className="space-y-5"
                        >

                            {/* EMAIL */}

                            <div>

                                <label className="
                                    mb-2
                                    block
                                    text-sm
                                    font-medium
                                    text-slate-700
                                ">
                                    Email
                                </label>

                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="you@example.com"
                                    required
                                    disabled={loading}
                                    className="
                                        w-full
                                        rounded-xl
                                        border
                                        border-slate-200
                                        bg-slate-50
                                        px-4
                                        py-3
                                        text-slate-900
                                        outline-none
                                        transition-all
                                        duration-300
                                        placeholder:text-slate-400
                                        focus:border-blue-500
                                        focus:bg-white
                                        focus:ring-4
                                        focus:ring-blue-500/10
                                        disabled:cursor-not-allowed
                                        disabled:opacity-60
                                    "
                                />

                            </div>


                            {/* PASSWORD */}

                            <div>

                                <label className="
                                    mb-2
                                    block
                                    text-sm
                                    font-medium
                                    text-slate-700
                                ">
                                    Password
                                </label>

                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    required
                                    disabled={loading}
                                    className="
                                        w-full
                                        rounded-xl
                                        border
                                        border-slate-200
                                        bg-slate-50
                                        px-4
                                        py-3
                                        text-slate-900
                                        outline-none
                                        transition-all
                                        duration-300
                                        placeholder:text-slate-400
                                        focus:border-blue-500
                                        focus:bg-white
                                        focus:ring-4
                                        focus:ring-blue-500/10
                                        disabled:cursor-not-allowed
                                        disabled:opacity-60
                                    "
                                />

                            </div>


                            {/* LOGIN BUTTON */}

                            <button
                                type="submit"
                                disabled={loading}
                                className="
                                    w-full
                                    rounded-xl
                                    bg-blue-600
                                    py-3.5
                                    font-semibold
                                    text-white
                                    shadow-lg
                                    shadow-blue-200
                                    transition-all
                                    duration-300
                                    hover:-translate-y-1
                                    hover:bg-blue-700
                                    hover:shadow-xl
                                    active:translate-y-0
                                    disabled:cursor-not-allowed
                                    disabled:opacity-60
                                    disabled:hover:translate-y-0
                                "
                            >

                                {loading
                                    ? "Logging in..."
                                    : "Login"
                                }

                            </button>

                        </form>


                        {/* =========================
                            SIGNUP
                        ========================= */}

                        <p className="
                            mt-6
                            text-center
                            text-sm
                            text-slate-500
                        ">
                            Don't have an account?{" "}

                            <Link
                                to="/signup"
                                className="
                                    font-semibold
                                    text-blue-600
                                    transition-colors
                                    duration-300
                                    hover:text-blue-700
                                    hover:underline
                                "
                            >
                                Create one
                            </Link>

                        </p>

                    </div>

                </div>

            </div>


            {/* =========================
                FOOTER
            ========================= */}

            <footer className="
                border-t
                border-slate-200
                bg-white
                py-6
            ">

                <p className="
                    text-center
                    text-sm
                    text-slate-500
                ">
                    © 2026{" "}
                    <span className="font-semibold text-slate-700">
                        CampusScrolls
                    </span>
                    . All rights reserved.
                </p>

            </footer>

        </div>
    );
};

export default Login;