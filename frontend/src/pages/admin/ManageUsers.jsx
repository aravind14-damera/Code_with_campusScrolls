import { useEffect, useState } from "react";


// =========================================================
// API URL
// =========================================================

const API_URL = import.meta.env.VITE_API_URL;


// =========================================================
// MANAGE USERS
// =========================================================

const ManageUsers = () => {

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    // =====================================================
    // FETCH USERS
    // =====================================================

    const fetchUsers = async () => {

        try {

            setLoading(true);
            setError("");


            // Your login stores access_token
            const token =
                localStorage.getItem("access_token");


            if (!token) {

                setError(
                    "Not authenticated. Please login again."
                );

                setLoading(false);

                return;
            }


            const response = await fetch(
                `${API_URL}/admin/users`,
                {
                    method: "GET",

                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );


            const data = await response.json();


            if (!response.ok) {

                throw new Error(
                    data.detail ||
                    "Failed to fetch users"
                );
            }


            setUsers(data);

        } catch (error) {

            console.error(
                "Error fetching users:",
                error
            );

            setError(error.message);

        } finally {

            setLoading(false);
        }
    };


    // =====================================================
    // LOAD USERS
    // =====================================================

    useEffect(() => {

        fetchUsers();

    }, []);


    // =====================================================
    // STATISTICS
    // =====================================================

    const totalUsers = users.length;

    const activeUsers = users.filter(
        user => user.status === "Active"
    ).length;

    const adminUsers = users.filter(
        user => user.role === "Admin"
    ).length;


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (

            <div className="min-h-screen bg-white p-8">

                <div className="
                    flex
                    justify-center
                    items-center
                    min-h-[400px]
                ">

                    <div className="text-center">

                        <div className="
                            w-10
                            h-10
                            border-4
                            border-blue-200
                            border-t-blue-600
                            rounded-full
                            animate-spin
                            mx-auto
                        "></div>

                        <p className="
                            mt-4
                            text-slate-500
                        ">
                            Loading users...
                        </p>

                    </div>

                </div>

            </div>
        );
    }


    // =====================================================
    // PAGE
    // =====================================================

    return (

        <div className="
            min-h-screen
            bg-white
            text-slate-900
            p-8
        ">

            {/* =================================================
                HEADER
            ================================================= */}

            <div className="
                flex
                flex-col
                md:flex-row
                md:items-center
                md:justify-between
                gap-4
                mb-10
            ">

                <div>

                    <p className="
                        text-sm
                        text-blue-600
                        font-medium
                        mb-2
                    ">
                        ADMIN PANEL
                    </p>

                    <h1 className="
                        text-4xl
                        font-bold
                    ">
                        Manage Users
                    </h1>

                    <p className="
                        text-slate-500
                        mt-2
                    ">
                        View and manage users registered on the platform.
                    </p>

                </div>

            </div>


            {/* =================================================
                ERROR
            ================================================= */}

            {error && (

                <div className="
                    mb-6
                    p-4
                    rounded-xl
                    bg-red-50
                    border
                    border-red-200
                    text-red-600
                    flex
                    items-center
                    justify-between
                ">

                    <span>
                        {error}
                    </span>

                    <button
                        onClick={fetchUsers}
                        className="
                            font-medium
                            underline
                        "
                    >
                        Retry
                    </button>

                </div>

            )}


            {/* =================================================
                STATISTICS
            ================================================= */}

            <div className="
                grid
                grid-cols-1
                md:grid-cols-3
                gap-6
                mb-10
            ">

                {/* TOTAL USERS */}

                <div className="
                    bg-white
                    border
                    border-slate-200
                    rounded-2xl
                    p-6
                    shadow-sm
                ">

                    <p className="
                        text-slate-500
                        text-sm
                    ">
                        Total Users
                    </p>

                    <h2 className="
                        text-3xl
                        font-bold
                        mt-2
                    ">
                        {totalUsers}
                    </h2>

                </div>


                {/* ACTIVE USERS */}

                <div className="
                    bg-white
                    border
                    border-slate-200
                    rounded-2xl
                    p-6
                    shadow-sm
                ">

                    <p className="
                        text-slate-500
                        text-sm
                    ">
                        Active Users
                    </p>

                    <h2 className="
                        text-3xl
                        font-bold
                        mt-2
                        text-green-600
                    ">
                        {activeUsers}
                    </h2>

                </div>


                {/* ADMIN USERS */}

                <div className="
                    bg-white
                    border
                    border-slate-200
                    rounded-2xl
                    p-6
                    shadow-sm
                ">

                    <p className="
                        text-slate-500
                        text-sm
                    ">
                        Administrators
                    </p>

                    <h2 className="
                        text-3xl
                        font-bold
                        mt-2
                        text-purple-600
                    ">
                        {adminUsers}
                    </h2>

                </div>

            </div>


            {/* =================================================
                USERS
            ================================================= */}

            <div className="
                bg-white
                border
                border-slate-200
                rounded-2xl
                overflow-hidden
                shadow-sm
            ">

                {/* HEADER */}

                <div className="
                    p-6
                    border-b
                    border-slate-200
                ">

                    <h2 className="
                        text-xl
                        font-semibold
                    ">
                        All Users
                    </h2>

                    <p className="
                        text-slate-500
                        mt-1
                    ">
                        Manage registered platform users.
                    </p>

                </div>


                {/* EMPTY */}

                {users.length === 0 ? (

                    <div className="
                        p-12
                        text-center
                    ">

                        <div className="
                            w-16
                            h-16
                            rounded-full
                            bg-slate-100
                            flex
                            items-center
                            justify-center
                            mx-auto
                            text-2xl
                        ">
                            👤
                        </div>

                        <h3 className="
                            text-lg
                            font-semibold
                            mt-4
                        ">
                            No users found
                        </h3>

                        <p className="
                            text-slate-500
                            mt-2
                        ">
                            No registered users are available.
                        </p>

                    </div>

                ) : (

                    <div className="overflow-x-auto">

                        <table className="
                            w-full
                            text-left
                        ">

                            {/* TABLE HEADER */}

                            <thead className="bg-slate-50">

                                <tr>

                                    <th className="
                                        px-6
                                        py-4
                                        text-sm
                                        font-medium
                                        text-slate-500
                                    ">
                                        User
                                    </th>

                                    <th className="
                                        px-6
                                        py-4
                                        text-sm
                                        font-medium
                                        text-slate-500
                                    ">
                                        Email
                                    </th>

                                    <th className="
                                        px-6
                                        py-4
                                        text-sm
                                        font-medium
                                        text-slate-500
                                    ">
                                        Role
                                    </th>

                                    <th className="
                                        px-6
                                        py-4
                                        text-sm
                                        font-medium
                                        text-slate-500
                                    ">
                                        Status
                                    </th>

                                </tr>

                            </thead>


                            {/* TABLE BODY */}

                            <tbody className="
                                divide-y
                                divide-slate-100
                            ">

                                {users.map((user) => (

                                    <tr
                                        key={user.id}
                                        className="
                                            hover:bg-slate-50
                                            transition
                                        "
                                    >

                                        {/* USER */}

                                        <td className="
                                            px-6
                                            py-5
                                        ">

                                            <div className="
                                                flex
                                                items-center
                                                gap-3
                                            ">

                                                <div className="
                                                    w-10
                                                    h-10
                                                    rounded-full
                                                    bg-blue-100
                                                    text-blue-600
                                                    flex
                                                    items-center
                                                    justify-center
                                                    font-semibold
                                                ">

                                                    {user.name
                                                        ?.charAt(0)
                                                        ?.toUpperCase() || "U"}

                                                </div>

                                                <div>

                                                    <p className="font-medium">
                                                        {user.name}
                                                    </p>

                                                </div>

                                            </div>

                                        </td>


                                        {/* EMAIL */}

                                        <td className="
                                            px-6
                                            py-5
                                            text-slate-600
                                        ">
                                            {user.email}
                                        </td>


                                        {/* ROLE */}

                                        <td className="
                                            px-6
                                            py-5
                                        ">

                                            <span className={`
                                                px-3
                                                py-1
                                                rounded-full
                                                text-xs
                                                font-medium

                                                ${
                                                    user.role === "Admin"
                                                        ? "bg-purple-50 text-purple-600"
                                                        : "bg-blue-50 text-blue-600"
                                                }
                                            `}>
                                                {user.role}
                                            </span>

                                        </td>


                                        {/* STATUS */}

                                        <td className="
                                            px-6
                                            py-5
                                        ">

                                            <span className={`
                                                px-3
                                                py-1
                                                rounded-full
                                                text-xs
                                                font-medium

                                                ${
                                                    user.status === "Active"
                                                        ? "bg-green-50 text-green-600"
                                                        : "bg-red-50 text-red-600"
                                                }
                                            `}>
                                                {user.status}
                                            </span>

                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>

        </div>
    );
};


export default ManageUsers;