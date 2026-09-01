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
    const [showPassword, setShowPassword] = useState(false);

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

            // After successful login go directly to Courses
            navigate("/courses");

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

            <div
                className="
                    flex
                    min-h-[calc(100vh-80px)]
                    items-center
                    justify-center
                    px-6
                    py-12
                "
            >

                <div className="w-full max-w-md">

                    {/* LOGO */}

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


                    {/* LOGIN CARD */}

                    <div
                        className="
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
                        "
                    >

                        {/* HEADER */}

                        <div className="mb-8 text-center">

                            <h1
                                className="
                                    text-3xl
                                    font-bold
                                    text-slate-900
                                "
                            >
                                Welcome back
                            </h1>

                            <p
                                className="
                                    mt-2
                                    text-slate-500
                                "
                            >
                                Login to continue your learning journey.
                            </p>

                        </div>


                        {/* ERROR */}

                        {error && (
                            <div
                                className="
                                    mb-5
                                    rounded-xl
                                    border
                                    border-red-200
                                    bg-red-50
                                    px-4
                                    py-3
                                    text-sm
                                    text-red-600
                                "
                            >
                                {error}
                            </div>
                        )}


                        {/* FORM */}

                        <form
                            onSubmit={handleSubmit}
                            className="space-y-5"
                        >

                            {/* EMAIL */}

                            <div>

                                <label
                                    className="
                                        mb-2
                                        block
                                        text-sm
                                        font-medium
                                        text-slate-700
                                    "
                                >
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

                                <label
                                    className="
                                        mb-2
                                        block
                                        text-sm
                                        font-medium
                                        text-slate-700
                                    "
                                >
                                    Password
                                </label>

                                <div className="relative">

                                    <input
                                        type={
                                            showPassword
                                                ? "text"
                                                : "password"
                                        }
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
                                            pr-12
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

                                    {/* ANIMATED EYE BUTTON */}

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword(
                                                !showPassword
                                            )
                                        }
                                        disabled={loading}
                                        aria-label={
                                            showPassword
                                                ? "Hide password"
                                                : "Show password"
                                        }
                                        className="
                                            absolute
                                            right-3
                                            top-1/2
                                            -translate-y-1/2
                                            rounded-lg
                                            p-2
                                            text-slate-400
                                            transition-all
                                            duration-300
                                            hover:scale-110
                                            hover:bg-slate-100
                                            hover:text-blue-600
                                            active:scale-90
                                            disabled:cursor-not-allowed
                                            disabled:opacity-50
                                        "
                                    >

                                        {showPassword ? (
                                            /* EYE OPEN */

                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                className="
                                                    h-5
                                                    w-5
                                                    animate-eye-open
                                                "
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M2.036 12.322a1.012 1.012 0 010-.644C3.423 7.51 7.36 4.5 12 4.5c4.64 0 8.577 3.01 9.964 7.178.07.208.07.436 0 .644C20.577 16.49 16.64 19.5 12 19.5c-4.64 0-8.577-3.01-9.964-7.178z"
                                                />

                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                                />
                                            </svg>

                                        ) : (
                                            /* EYE CLOSED */

                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                className="
                                                    h-5
                                                    w-5
                                                    animate-eye-closed
                                                "
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M3 3l18 18"
                                                />

                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M10.584 10.587a2 2 0 002.829 2.829"
                                                />

                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M9.88 4.24A9.77 9.77 0 0112 4c4.64 0 8.577 3.01 9.964 7.178a1.012 1.012 0 010 .644 10.05 10.05 0 01-4.1 5.12"
                                                />

                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M6.61 6.61A10.05 10.05 0 002.036 11.68a1.012 1.012 0 000 .644C3.423 16.49 7.36 19.5 12 19.5a9.77 9.77 0 004.11-.9"
                                                />
                                            </svg>
                                        )}

                                    </button>

                                </div>

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


                        {/* SIGNUP */}

                        <p
                            className="
                                mt-6
                                text-center
                                text-sm
                                text-slate-500
                            "
                        >
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

        </div>
    );
};

export default Login;