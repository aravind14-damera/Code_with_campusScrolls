import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const API_URL = "http://localhost:8000";

const Profile = () => {
    const navigate = useNavigate();
    const { logout } = useContext(AuthContext);

    const [user, setUser] = useState(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [editing, setEditing] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
    });

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState("");

    // =====================================================
    // GET CURRENT USER
    // =====================================================

    useEffect(() => {
        const fetchUser = async () => {
            try {
                setLoading(true);
                setError("");

                const token = localStorage.getItem("access_token");

                if (!token) {
                    navigate("/login");
                    return;
                }

                const response = await axios.get(
                    `${API_URL}/auth/me`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                console.log("Current user:", response.data);

                setUser(response.data);

                setFormData({
                    name: response.data.name || "",
                    email: response.data.email || "",
                });

            } catch (err) {
                console.error("Profile error:", err);

                if (err.response?.status === 401) {
                    logout();
                    navigate("/login");
                    return;
                }

                setError(
                    err.response?.data?.detail ||
                    "Unable to load profile."
                );

            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [navigate, logout]);

    // =====================================================
    // HANDLE INPUT
    // =====================================================

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    // =====================================================
    // SAVE PROFILE
    // =====================================================

    const handleSave = () => {
        /*
         * Your current backend does NOT have an endpoint
         * for updating name/email.
         *
         * So for now we only update the UI state.
         *
         * We can create PUT /auth/me next.
         */

        setUser({
            ...user,
            name: formData.name,
            email: formData.email,
        });

        setEditing(false);
    };

    // =====================================================
    // DELETE ACCOUNT
    // =====================================================

    const handleDeleteAccount = async () => {
        try {
            setDeleting(true);
            setDeleteError("");

            const token = localStorage.getItem("access_token");

            await axios.delete(
                `${API_URL}/auth/me`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            // Remove authentication
            logout();

            // Go to home
            navigate("/");

        } catch (error) {
            console.error("Delete account error:", error);

            setDeleteError(
                error.response?.data?.detail ||
                "Unable to delete your account. Please try again."
            );

            setDeleting(false);
        }
    };

    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <p className="text-slate-500">
                    Loading profile...
                </p>
            </div>
        );
    }

    // =====================================================
    // ERROR
    // =====================================================

    if (error || !user) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center px-6">
                <div className="text-center">

                    <h1 className="text-2xl font-bold text-slate-900">
                        Unable to load profile
                    </h1>

                    <p className="mt-2 text-slate-500">
                        {error}
                    </p>

                    <button
                        onClick={() => navigate("/courses")}
                        className="mt-6 px-5 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                    >
                        Go to Courses
                    </button>

                </div>
            </div>
        );
    }

    // =====================================================
    // FORMAT JOIN DATE
    // =====================================================

    const joinedDate = user.created_at
        ? new Date(user.created_at).toLocaleDateString(
              "en-US",
              {
                  month: "long",
                  year: "numeric",
              }
          )
        : "Not available";

    // =====================================================
    // UI
    // =====================================================

    return (
        <div className="min-h-screen bg-white text-slate-900">

            {/* HEADER */}

            <header className="border-b border-slate-200 bg-white">

                <div className="max-w-5xl mx-auto px-6 py-8">

                    <button
                        onClick={() => navigate("/courses")}
                        className="mb-6 text-sm text-slate-500 hover:text-blue-600 transition"
                    >
                        ← Back to Courses
                    </button>

                    <p className="text-blue-600 text-sm font-semibold tracking-wider mb-2">
                        ACCOUNT
                    </p>

                    <h1 className="text-4xl font-bold text-slate-900">
                        My Profile
                    </h1>

                    <p className="text-slate-500 mt-2">
                        Manage your account information and preferences.
                    </p>

                </div>

            </header>


            {/* MAIN */}

            <main className="max-w-5xl mx-auto px-6 py-10">

                {/* PROFILE CARD */}

                <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">

                    {/* PROFILE HEADER */}

                    <div className="bg-white p-8 border-b border-slate-200">

                        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">

                            {/* AVATAR */}

                            <div className="w-24 h-24 rounded-3xl bg-blue-600 flex items-center justify-center text-3xl font-bold text-white shadow-lg shadow-blue-200">
                                {user.name?.charAt(0)?.toUpperCase() || "U"}
                            </div>

                            {/* USER */}

                            <div className="text-center sm:text-left">

                                <h2 className="text-2xl font-bold text-slate-900">
                                    {user.name}
                                </h2>

                                <p className="text-slate-500 mt-1">
                                    {user.email}
                                </p>

                                <span className="inline-block mt-3 px-3 py-1 rounded-full bg-blue-100 text-blue-600 text-xs font-medium">
                                    {user.role}
                                </span>

                            </div>

                        </div>

                    </div>


                    {/* PERSONAL INFORMATION */}

                    <div className="p-8">

                        <div className="flex items-center justify-between mb-7">

                            <div>

                                <h3 className="text-xl font-semibold text-slate-900">
                                    Personal Information
                                </h3>

                                <p className="text-slate-500 text-sm mt-1">
                                    Your account details
                                </p>

                            </div>

                            {!editing && (
                                <button
                                    onClick={() => setEditing(true)}
                                    className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition text-sm font-medium"
                                >
                                    Edit Profile
                                </button>
                            )}

                        </div>


                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                            {/* NAME */}

                            <div>

                                <label className="block text-sm text-slate-500 mb-2">
                                    Full Name
                                </label>

                                {editing ? (

                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 focus:border-blue-500 focus:outline-none transition"
                                    />

                                ) : (

                                    <div className="px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800">
                                        {user.name}
                                    </div>

                                )}

                            </div>


                            {/* EMAIL */}

                            <div>

                                <label className="block text-sm text-slate-500 mb-2">
                                    Email Address
                                </label>

                                {editing ? (

                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 focus:border-blue-500 focus:outline-none transition"
                                    />

                                ) : (

                                    <div className="px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800">
                                        {user.email}
                                    </div>

                                )}

                            </div>


                            {/* ROLE */}

                            <div>

                                <label className="block text-sm text-slate-500 mb-2">
                                    Account Type
                                </label>

                                <div className="px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 capitalize">
                                    {user.role}
                                </div>

                            </div>


                            {/* JOINED */}

                            <div>

                                <label className="block text-sm text-slate-500 mb-2">
                                    Joined
                                </label>

                                <div className="px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800">
                                    {joinedDate}
                                </div>

                            </div>

                        </div>


                        {/* EDIT ACTIONS */}

                        {editing && (

                            <div className="flex justify-end gap-3 mt-8">

                                <button
                                    onClick={() => {
                                        setEditing(false);

                                        setFormData({
                                            name: user.name,
                                            email: user.email,
                                        });
                                    }}
                                    className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition font-medium"
                                >
                                    Cancel
                                </button>

                                <button
                                    onClick={handleSave}
                                    className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition font-medium"
                                >
                                    Save Changes
                                </button>

                            </div>

                        )}

                    </div>

                </div>


                {/* DELETE ACCOUNT */}

                <div className="mt-8 flex items-center justify-between gap-6 border border-red-200 rounded-2xl px-6 py-5 bg-white">

                    <div>

                        <h3 className="text-base font-semibold text-red-600">
                            Delete Account
                        </h3>

                        <p className="text-slate-500 text-sm mt-1">
                            Permanently delete your account and all associated data.
                        </p>

                    </div>

                    <button
                        onClick={() => {
                            setDeleteError("");
                            setShowDeleteModal(true);
                        }}
                        className="shrink-0 px-4 py-2 rounded-lg border border-red-300 text-red-600 hover:bg-red-600 hover:text-white transition text-sm font-medium"
                    >
                        Delete
                    </button>

                </div>


                {deleteError && (

                    <p className="mt-3 text-sm text-red-600">
                        {deleteError}
                    </p>

                )}

            </main>


            {/* DELETE CONFIRMATION MODAL */}

            {showDeleteModal && (

                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-6">

                    <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-7 shadow-2xl">

                        <h2 className="text-xl font-bold text-slate-900">
                            Delete your account?
                        </h2>

                        <p className="text-slate-500 mt-3 leading-6 text-sm">
                            This will permanently delete your account and all
                            associated data. This action cannot be undone.
                        </p>

                        <div className="flex justify-end gap-3 mt-7">

                            <button
                                onClick={() => setShowDeleteModal(false)}
                                disabled={deleting}
                                className="px-4 py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition text-sm font-medium"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleDeleteAccount}
                                disabled={deleting}
                                className="px-4 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white transition text-sm font-medium disabled:opacity-50"
                            >
                                {deleting
                                    ? "Deleting..."
                                    : "Yes, Delete"}
                            </button>

                        </div>

                    </div>

                </div>

            )}

        </div>
    );
};

export default Profile;