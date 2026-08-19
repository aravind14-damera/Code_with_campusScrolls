import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Profile = () => {
    const navigate = useNavigate();

    const [user, setUser] = useState({
        name: "Aravind Damera",
        email: "aravind@example.com",
        role: "Student",
        joined: "August 2026",
    });

    const [editing, setEditing] = useState(false);

    const [formData, setFormData] = useState({
        name: user.name,
        email: user.email,
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSave = () => {
        setUser({
            ...user,
            name: formData.name,
            email: formData.email,
        });

        setEditing(false);
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white">

            {/* Header */}
            <header className="border-b border-slate-800 bg-slate-950">

                <div className="max-w-5xl mx-auto px-6 py-8">

                    <button
                        onClick={() => navigate("/dashboard")}
                        className="
                            text-sm
                            text-slate-400
                            hover:text-white
                            transition
                            mb-6
                        "
                    >
                        ← Back to Dashboard
                    </button>

                    <p className="text-indigo-400 text-sm font-semibold mb-2">
                        ACCOUNT
                    </p>

                    <h1 className="text-3xl font-bold">
                        My Profile
                    </h1>

                    <p className="text-slate-400 mt-2">
                        Manage your account information and learning profile.
                    </p>

                </div>

            </header>

            {/* Main */}
            <main className="max-w-5xl mx-auto px-6 py-10">

                {/* Profile Card */}
                <div
                    className="
                        bg-slate-900
                        border
                        border-slate-800
                        rounded-3xl
                        overflow-hidden
                    "
                >

                    {/* Profile Top */}
                    <div
                        className="
                            bg-gradient-to-r
                            from-indigo-600/20
                            to-purple-600/20
                            p-8
                            border-b
                            border-slate-800
                        "
                    >

                        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">

                            {/* Avatar */}
                            <div
                                className="
                                    w-24
                                    h-24
                                    rounded-2xl
                                    bg-indigo-600
                                    flex
                                    items-center
                                    justify-center
                                    text-3xl
                                    font-bold
                                    shadow-lg
                                    shadow-indigo-500/20
                                "
                            >
                                {user.name.charAt(0)}
                            </div>

                            <div className="text-center sm:text-left">

                                <h2 className="text-2xl font-bold">
                                    {user.name}
                                </h2>

                                <p className="text-slate-400 mt-1">
                                    {user.email}
                                </p>

                                <span
                                    className="
                                        inline-block
                                        mt-3
                                        px-3
                                        py-1
                                        rounded-full
                                        bg-indigo-500/10
                                        text-indigo-400
                                        text-xs
                                        font-medium
                                    "
                                >
                                    {user.role}
                                </span>

                            </div>

                        </div>

                    </div>

                    {/* Information */}
                    <div className="p-8">

                        <div className="flex items-center justify-between mb-7">

                            <div>
                                <h3 className="text-xl font-semibold">
                                    Personal Information
                                </h3>

                                <p className="text-slate-500 text-sm mt-1">
                                    Your account details
                                </p>
                            </div>

                            {!editing && (
                                <button
                                    onClick={() => setEditing(true)}
                                    className="
                                        px-4
                                        py-2
                                        rounded-xl
                                        bg-slate-800
                                        hover:bg-slate-700
                                        transition
                                        text-sm
                                        font-medium
                                    "
                                >
                                    Edit Profile
                                </button>
                            )}

                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                            {/* Name */}
                            <div>

                                <label className="block text-sm text-slate-400 mb-2">
                                    Full Name
                                </label>

                                {editing ? (
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="
                                            w-full
                                            px-4
                                            py-3
                                            rounded-xl
                                            bg-slate-950
                                            border
                                            border-slate-700
                                            focus:border-indigo-500
                                            focus:outline-none
                                            transition
                                        "
                                    />
                                ) : (
                                    <div
                                        className="
                                            px-4
                                            py-3
                                            rounded-xl
                                            bg-slate-950
                                            border
                                            border-slate-800
                                            text-slate-200
                                        "
                                    >
                                        {user.name}
                                    </div>
                                )}

                            </div>

                            {/* Email */}
                            <div>

                                <label className="block text-sm text-slate-400 mb-2">
                                    Email Address
                                </label>

                                {editing ? (
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="
                                            w-full
                                            px-4
                                            py-3
                                            rounded-xl
                                            bg-slate-950
                                            border
                                            border-slate-700
                                            focus:border-indigo-500
                                            focus:outline-none
                                            transition
                                        "
                                    />
                                ) : (
                                    <div
                                        className="
                                            px-4
                                            py-3
                                            rounded-xl
                                            bg-slate-950
                                            border
                                            border-slate-800
                                            text-slate-200
                                        "
                                    >
                                        {user.email}
                                    </div>
                                )}

                            </div>

                            {/* Role */}
                            <div>

                                <label className="block text-sm text-slate-400 mb-2">
                                    Account Type
                                </label>

                                <div
                                    className="
                                        px-4
                                        py-3
                                        rounded-xl
                                        bg-slate-950
                                        border
                                        border-slate-800
                                    "
                                >
                                    {user.role}
                                </div>

                            </div>

                            {/* Joined */}
                            <div>

                                <label className="block text-sm text-slate-400 mb-2">
                                    Joined
                                </label>

                                <div
                                    className="
                                        px-4
                                        py-3
                                        rounded-xl
                                        bg-slate-950
                                        border
                                        border-slate-800
                                    "
                                >
                                    {user.joined}
                                </div>

                            </div>

                        </div>

                        {/* Edit Actions */}
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
                                    className="
                                        px-5
                                        py-2.5
                                        rounded-xl
                                        bg-slate-800
                                        hover:bg-slate-700
                                        transition
                                        font-medium
                                    "
                                >
                                    Cancel
                                </button>

                                <button
                                    onClick={handleSave}
                                    className="
                                        px-5
                                        py-2.5
                                        rounded-xl
                                        bg-indigo-600
                                        hover:bg-indigo-500
                                        transition
                                        font-medium
                                        shadow-lg
                                        shadow-indigo-500/20
                                    "
                                >
                                    Save Changes
                                </button>

                            </div>

                        )}

                    </div>

                </div>

                {/* Learning Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">

                    <div
                        className="
                            bg-slate-900
                            border
                            border-slate-800
                            rounded-2xl
                            p-6
                            hover:border-indigo-500/50
                            hover:-translate-y-1
                            transition
                        "
                    >
                        <p className="text-slate-400 text-sm">
                            Courses Enrolled
                        </p>

                        <h3 className="text-3xl font-bold mt-2">
                            0
                        </h3>
                    </div>

                    <div
                        className="
                            bg-slate-900
                            border
                            border-slate-800
                            rounded-2xl
                            p-6
                            hover:border-green-500/50
                            hover:-translate-y-1
                            transition
                        "
                    >
                        <p className="text-slate-400 text-sm">
                            Topics Completed
                        </p>

                        <h3 className="text-3xl font-bold mt-2 text-green-400">
                            0
                        </h3>
                    </div>

                    <div
                        className="
                            bg-slate-900
                            border
                            border-slate-800
                            rounded-2xl
                            p-6
                            hover:border-purple-500/50
                            hover:-translate-y-1
                            transition
                        "
                    >
                        <p className="text-slate-400 text-sm">
                            Overall Progress
                        </p>

                        <h3 className="text-3xl font-bold mt-2 text-purple-400">
                            0%
                        </h3>
                    </div>

                </div>

            </main>

        </div>
    );
};

export default Profile;