import { useState } from "react";

const ManageUsers = () => {
    const [users] = useState([
        {
            id: 1,
            name: "Aravind",
            email: "aravind@example.com",
            role: "Student",
            status: "Active",
        },
        {
            id: 2,
            name: "Rahul",
            email: "rahul@example.com",
            role: "Student",
            status: "Active",
        },
        {
            id: 3,
            name: "Admin User",
            email: "admin@example.com",
            role: "Admin",
            status: "Active",
        },
        {
            id: 4,
            name: "Kiran",
            email: "kiran@example.com",
            role: "Student",
            status: "Inactive",
        },
    ]);

    return (
        <div className="min-h-screen bg-slate-950 text-white p-8">

            {/* Header */}
            <div className="mb-10">

                <p className="text-sm text-indigo-400 font-medium mb-2">
                    ADMIN PANEL
                </p>

                <h1 className="text-4xl font-bold">
                    Manage Users
                </h1>

                <p className="text-slate-400 mt-2">
                    View and manage users registered on the platform.
                </p>

            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">

                <div
                    className="
                        bg-slate-900
                        border border-slate-800
                        rounded-2xl
                        p-6
                        hover:border-indigo-500/50
                        transition
                    "
                >
                    <p className="text-slate-400 text-sm">
                        Total Users
                    </p>

                    <h2 className="text-3xl font-bold mt-2">
                        {users.length}
                    </h2>
                </div>

                <div
                    className="
                        bg-slate-900
                        border border-slate-800
                        rounded-2xl
                        p-6
                        hover:border-green-500/50
                        transition
                    "
                >
                    <p className="text-slate-400 text-sm">
                        Active Users
                    </p>

                    <h2 className="text-3xl font-bold mt-2 text-green-400">
                        {
                            users.filter(
                                user => user.status === "Active"
                            ).length
                        }
                    </h2>
                </div>

                <div
                    className="
                        bg-slate-900
                        border border-slate-800
                        rounded-2xl
                        p-6
                        hover:border-purple-500/50
                        transition
                    "
                >
                    <p className="text-slate-400 text-sm">
                        Administrators
                    </p>

                    <h2 className="text-3xl font-bold mt-2 text-purple-400">
                        {
                            users.filter(
                                user => user.role === "Admin"
                            ).length
                        }
                    </h2>
                </div>

            </div>

            {/* Users Table */}
            <div
                className="
                    bg-slate-900
                    border border-slate-800
                    rounded-2xl
                    overflow-hidden
                "
            >

                <div className="p-6 border-b border-slate-800">
                    <h2 className="text-xl font-semibold">
                        All Users
                    </h2>
                </div>

                <div className="overflow-x-auto">

                    <table className="w-full text-left">

                        <thead className="bg-slate-800/50">

                            <tr>

                                <th className="px-6 py-4 text-sm text-slate-400">
                                    User
                                </th>

                                <th className="px-6 py-4 text-sm text-slate-400">
                                    Email
                                </th>

                                <th className="px-6 py-4 text-sm text-slate-400">
                                    Role
                                </th>

                                <th className="px-6 py-4 text-sm text-slate-400">
                                    Status
                                </th>

                                <th className="px-6 py-4 text-sm text-slate-400">
                                    Action
                                </th>

                            </tr>

                        </thead>

                        <tbody className="divide-y divide-slate-800">

                            {users.map((user) => (

                                <tr
                                    key={user.id}
                                    className="
                                        hover:bg-slate-800/40
                                        transition
                                    "
                                >

                                    {/* User */}
                                    <td className="px-6 py-5">

                                        <div className="flex items-center gap-3">

                                            <div
                                                className="
                                                    w-10 h-10
                                                    rounded-full
                                                    bg-indigo-500/20
                                                    text-indigo-400
                                                    flex items-center
                                                    justify-center
                                                    font-semibold
                                                "
                                            >
                                                {user.name.charAt(0)}
                                            </div>

                                            <span className="font-medium">
                                                {user.name}
                                            </span>

                                        </div>

                                    </td>

                                    {/* Email */}
                                    <td className="px-6 py-5 text-slate-400">
                                        {user.email}
                                    </td>

                                    {/* Role */}
                                    <td className="px-6 py-5">

                                        <span
                                            className={`
                                                px-3 py-1
                                                rounded-full
                                                text-xs
                                                ${
                                                    user.role === "Admin"
                                                        ? "bg-purple-500/10 text-purple-400"
                                                        : "bg-blue-500/10 text-blue-400"
                                                }
                                            `}
                                        >
                                            {user.role}
                                        </span>

                                    </td>

                                    {/* Status */}
                                    <td className="px-6 py-5">

                                        <span
                                            className={`
                                                px-3 py-1
                                                rounded-full
                                                text-xs
                                                ${
                                                    user.status === "Active"
                                                        ? "bg-green-500/10 text-green-400"
                                                        : "bg-red-500/10 text-red-400"
                                                }
                                            `}
                                        >
                                            {user.status}
                                        </span>

                                    </td>

                                    {/* Action */}
                                    <td className="px-6 py-5">

                                        <button
                                            className="
                                                px-4 py-2
                                                rounded-lg
                                                bg-slate-800
                                                hover:bg-slate-700
                                                transition
                                            "
                                        >
                                            View
                                        </button>

                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                </div>

            </div>

        </div>
    );
};

export default ManageUsers;