import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const Signup = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

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
            await axios.post(
                `${API_URL}/auth/signup`,
                {
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                }
            );

            // Account successfully created
            setSuccess(true);

            // Redirect to login
            setTimeout(() => {
                navigate("/login");
            }, 1800);

        } catch (error) {

            console.error("Signup error:", error);

            if (error.response) {

                setError(
                    error.response.data?.detail ||
                    "Unable to create account."
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
                SIGNUP SECTION
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
                        SUCCESS
                    ========================= */}

                    {success ? (

                        <div className="
                            rounded-3xl
                            border
                            border-green-200
                            bg-green-50
                            p-10
                            text-center
                            shadow-xl
                            shadow-green-100
                        ">

                            <div className="
                                mx-auto
                                flex
                                h-16
                                w-16
                                items-center
                                justify-center
                                rounded-full
                                bg-green-100
                                text-3xl
                                text-green-600
                            ">
                                ✓
                            </div>

                            <h1 className="
                                mt-6
                                text-2xl
                                font-bold
                                text-green-700
                            ">
                                Account Created!
                            </h1>

                            <p className="
                                mt-3
                                text-green-600
                            ">
                                Your account has been created successfully.
                            </p>

                            <p className="
                                mt-2
                                text-sm
                                text-slate-500
                            ">
                                Redirecting you to login...
                            </p>

                        </div>

                    ) : (

                        /* =========================
                           SIGNUP CARD
                        ========================= */

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

                            {/* HEADER */}

                            <div className="mb-8 text-center">

                                <h1 className="
                                    text-3xl
                                    font-bold
                                    text-slate-900
                                ">
                                    Create your account
                                </h1>

                                <p className="
                                    mt-2
                                    text-slate-500
                                ">
                                    Start your coding journey today.
                                </p>

                            </div>


                            {/* ERROR */}

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


                            {/* FORM */}

                            <form
                                onSubmit={handleSubmit}
                                className="space-y-5"
                            >

                                {/* NAME */}

                                <div>

                                    <label className="
                                        mb-2
                                        block
                                        text-sm
                                        font-medium
                                        text-slate-700
                                    ">
                                        Full Name
                                    </label>

                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Your name"
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
                                        placeholder="Create a password"
                                        required
                                        minLength={6}
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


                                {/* SUBMIT */}

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
                                        ? "Creating Account..."
                                        : "Create Account"
                                    }

                                </button>

                            </form>


                            {/* LOGIN */}

                            <p className="
                                mt-6
                                text-center
                                text-sm
                                text-slate-500
                            ">
                                Already have an account?{" "}

                                <Link
                                    to="/login"
                                    className="
                                        font-semibold
                                        text-blue-600
                                        transition-colors
                                        duration-300
                                        hover:text-blue-700
                                        hover:underline
                                    "
                                >
                                    Login
                                </Link>

                            </p>

                        </div>
                    )}

                </div>

            </div>

        </div>
    );
};

export default Signup;