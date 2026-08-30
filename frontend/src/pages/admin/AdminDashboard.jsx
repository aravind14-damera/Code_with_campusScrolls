import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL;

const AdminDashboard = () => {

    const {
        token,
        loading: authLoading
    } = useContext(AuthContext);


    const [statistics, setStatistics] = useState({
        total_users: 0,
        total_courses: 0,
        total_modules: 0,
        total_topics: 0,
    });


    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    // =====================================================
    // GET ADMIN DASHBOARD DATA
    // =====================================================

    useEffect(() => {

        if (authLoading) {
            return;
        }


        if (!token) {

            setError(
                "You are not authenticated. Please login again."
            );

            setLoading(false);

            return;
        }


        const fetchDashboard = async () => {

            try {

                setLoading(true);
                setError("");


                const response = await axios.get(
                    `${API_URL}/admin/dashboard`,
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`,
                        },
                    }
                );


                console.log(
                    "Admin dashboard:",
                    response.data
                );


                setStatistics(
                    response.data.statistics || {
                        total_users: 0,
                        total_courses: 0,
                        total_modules: 0,
                        total_topics: 0,
                    }
                );


            } catch (err) {

                console.error(
                    "Admin dashboard error:",
                    err
                );


                if (
                    err.response?.status === 401
                ) {

                    setError(
                        "Your login session has expired. Please login again."
                    );

                } else if (
                    err.response?.status === 403
                ) {

                    setError(
                        "You do not have admin access."
                    );

                } else {

                    setError(
                        err.response?.data?.detail ||
                        err.response?.data?.error ||
                        "Failed to load dashboard data."
                    );

                }


            } finally {

                setLoading(false);

            }

        };


        fetchDashboard();

    }, [token, authLoading]);


    // =====================================================
    // LOADING
    // =====================================================

    if (authLoading || loading) {

        return (

            <div className="
                min-h-[calc(100vh-5rem)]
                bg-white
                flex
                items-center
                justify-center
            ">

                <div className="text-center">

                    <div className="
                        mx-auto
                        mb-4
                        h-8
                        w-8
                        animate-spin
                        rounded-full
                        border-4
                        border-slate-200
                        border-t-blue-600
                    " />

                    <p className="text-slate-500">
                        Loading dashboard...
                    </p>

                </div>

            </div>

        );

    }


    // =====================================================
    // UI
    // =====================================================

    return (

        <div className="
            min-h-[calc(100vh-5rem)]
            bg-white
        ">


            {/* =================================================
                HEADER
            ================================================= */}

            <div className="
                border-b
                border-slate-200
                bg-white
            ">

                <div className="
                    mx-auto
                    max-w-7xl
                    px-6
                    py-8
                ">

                    <h1 className="
                        text-3xl
                        font-bold
                        text-slate-900
                    ">
                        Admin Dashboard
                    </h1>


                    <p className="
                        mt-2
                        text-slate-500
                    ">
                        Manage Campus Scrolls from one place.
                    </p>

                </div>

            </div>


            {/* =================================================
                MAIN
            ================================================= */}

            <div className="
                mx-auto
                max-w-7xl
                px-6
                py-8
            ">


                {/* =================================================
                    ERROR
                ================================================= */}

                {error && (

                    <div className="
                        mb-6
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
                    STATISTICS
                ================================================= */}

                <div className="
                    grid
                    grid-cols-1
                    gap-6
                    sm:grid-cols-2
                    lg:grid-cols-4
                ">


                    {/* USERS */}

                    <div className="
                        rounded-xl
                        border
                        border-slate-200
                        bg-white
                        p-6
                        shadow-sm
                    ">

                        <p className="
                            text-sm
                            font-medium
                            text-slate-500
                        ">
                            Total Users
                        </p>


                        <h2 className="
                            mt-3
                            text-3xl
                            font-bold
                            text-slate-900
                        ">
                            {statistics.total_users}
                        </h2>


                        <p className="
                            mt-2
                            text-sm
                            text-slate-400
                        ">
                            Registered students
                        </p>

                    </div>


                    {/* COURSES */}

                    <div className="
                        rounded-xl
                        border
                        border-slate-200
                        bg-white
                        p-6
                        shadow-sm
                    ">

                        <p className="
                            text-sm
                            font-medium
                            text-slate-500
                        ">
                            Total Courses
                        </p>


                        <h2 className="
                            mt-3
                            text-3xl
                            font-bold
                            text-slate-900
                        ">
                            {statistics.total_courses}
                        </h2>


                        <p className="
                            mt-2
                            text-sm
                            text-slate-400
                        ">
                            Available courses
                        </p>

                    </div>


                    {/* MODULES */}

                    <div className="
                        rounded-xl
                        border
                        border-slate-200
                        bg-white
                        p-6
                        shadow-sm
                    ">

                        <p className="
                            text-sm
                            font-medium
                            text-slate-500
                        ">
                            Total Modules
                        </p>


                        <h2 className="
                            mt-3
                            text-3xl
                            font-bold
                            text-slate-900
                        ">
                            {statistics.total_modules}
                        </h2>


                        <p className="
                            mt-2
                            text-sm
                            text-slate-400
                        ">
                            Course modules
                        </p>

                    </div>


                    {/* TOPICS */}

                    <div className="
                        rounded-xl
                        border
                        border-slate-200
                        bg-white
                        p-6
                        shadow-sm
                    ">

                        <p className="
                            text-sm
                            font-medium
                            text-slate-500
                        ">
                            Total Topics
                        </p>


                        <h2 className="
                            mt-3
                            text-3xl
                            font-bold
                            text-slate-900
                        ">
                            {statistics.total_topics}
                        </h2>


                        <p className="
                            mt-2
                            text-sm
                            text-slate-400
                        ">
                            Learning topics
                        </p>

                    </div>

                </div>


                {/* =================================================
                    MANAGEMENT
                ================================================= */}

                <div className="mt-10">

                    <h2 className="
                        text-xl
                        font-bold
                        text-slate-900
                    ">
                        Management
                    </h2>


                    <p className="
                        mt-1
                        text-sm
                        text-slate-500
                    ">
                        Manage the different parts of the learning platform.
                    </p>


                    <div className="
                        mt-6
                        grid
                        grid-cols-1
                        gap-6
                        md:grid-cols-2
                        lg:grid-cols-3
                    ">


                        {/* =================================================
                            COURSES
                        ================================================= */}

                        <Link
                            to="/admin/courses"
                            className="
                                group
                                rounded-xl
                                border
                                border-slate-200
                                bg-white
                                p-6
                                shadow-sm
                                transition
                                hover:border-blue-300
                                hover:shadow-md
                            "
                        >

                            <h3 className="
                                text-lg
                                font-semibold
                                text-slate-900
                                group-hover:text-blue-600
                            ">
                                Manage Courses
                            </h3>


                            <p className="
                                mt-2
                                text-sm
                                leading-6
                                text-slate-500
                            ">
                                Create, edit, publish and manage courses.
                            </p>


                            <span className="
                                mt-4
                                inline-block
                                text-sm
                                font-medium
                                text-blue-600
                            ">
                                Open Courses →
                            </span>

                        </Link>


                        {/* =================================================
                            MODULES
                        ================================================= */}

                        <Link
                            to="/admin/modules"
                            className="
                                group
                                rounded-xl
                                border
                                border-slate-200
                                bg-white
                                p-6
                                shadow-sm
                                transition
                                hover:border-blue-300
                                hover:shadow-md
                            "
                        >

                            <h3 className="
                                text-lg
                                font-semibold
                                text-slate-900
                                group-hover:text-blue-600
                            ">
                                Manage Modules
                            </h3>


                            <p className="
                                mt-2
                                text-sm
                                leading-6
                                text-slate-500
                            ">
                                Organize modules inside your courses.
                            </p>


                            <span className="
                                mt-4
                                inline-block
                                text-sm
                                font-medium
                                text-blue-600
                            ">
                                Open Modules →
                            </span>

                        </Link>


                        {/* =================================================
                            TOPICS
                        ================================================= */}

                        <Link
                            to="/admin/topics"
                            className="
                                group
                                rounded-xl
                                border
                                border-slate-200
                                bg-white
                                p-6
                                shadow-sm
                                transition
                                hover:border-blue-300
                                hover:shadow-md
                            "
                        >

                            <h3 className="
                                text-lg
                                font-semibold
                                text-slate-900
                                group-hover:text-blue-600
                            ">
                                Manage Topics
                            </h3>


                            <p className="
                                mt-2
                                text-sm
                                leading-6
                                text-slate-500
                            ">
                                Create and manage learning topics.
                            </p>


                            <span className="
                                mt-4
                                inline-block
                                text-sm
                                font-medium
                                text-blue-600
                            ">
                                Open Topics →
                            </span>

                        </Link>


                        {/* =================================================
                            PROBLEMS
                        ================================================= */}

                        <Link
                            to="/admin/problems"
                            className="
                                group
                                rounded-xl
                                border
                                border-slate-200
                                bg-white
                                p-6
                                shadow-sm
                                transition
                                hover:border-blue-300
                                hover:shadow-md
                            "
                        >

                            <h3 className="
                                text-lg
                                font-semibold
                                text-slate-900
                                group-hover:text-blue-600
                            ">
                                Manage Problems
                            </h3>


                            <p className="
                                mt-2
                                text-sm
                                leading-6
                                text-slate-500
                            ">
                                Add and manage coding problems.
                            </p>


                            <span className="
                                mt-4
                                inline-block
                                text-sm
                                font-medium
                                text-blue-600
                            ">
                                Open Problems →
                            </span>

                        </Link>


                        {/* =================================================
                            STUDY MATERIALS  ← NEW
                        ================================================= */}

                        <Link
                            to="/admin/materials"
                            className="
                                group
                                rounded-xl
                                border
                                border-slate-200
                                bg-white
                                p-6
                                shadow-sm
                                transition
                                hover:border-orange-300
                                hover:shadow-md
                            "
                        >

                            <h3 className="
                                text-lg
                                font-semibold
                                text-slate-900
                                group-hover:text-orange-600
                            ">
                                Manage Study Materials
                            </h3>


                            <p className="
                                mt-2
                                text-sm
                                leading-6
                                text-slate-500
                            ">
                                Upload and manage study material PDFs.
                            </p>


                            <span className="
                                mt-4
                                inline-block
                                text-sm
                                font-medium
                                text-orange-600
                            ">
                                Open Study Materials →
                            </span>

                        </Link>


                        {/* =================================================
                            USERS
                        ================================================= */}

                        <Link
                            to="/admin/users"
                            className="
                                group
                                rounded-xl
                                border
                                border-slate-200
                                bg-white
                                p-6
                                shadow-sm
                                transition
                                hover:border-blue-300
                                hover:shadow-md
                            "
                        >

                            <h3 className="
                                text-lg
                                font-semibold
                                text-slate-900
                                group-hover:text-blue-600
                            ">
                                Manage Users
                            </h3>


                            <p className="
                                mt-2
                                text-sm
                                leading-6
                                text-slate-500
                            ">
                                View and manage registered students.
                            </p>


                            <span className="
                                mt-4
                                inline-block
                                text-sm
                                font-medium
                                text-blue-600
                            ">
                                Open Users →
                            </span>

                        </Link>


                    </div>

                </div>


                {/* =================================================
                    QUICK ACTIONS
                ================================================= */}

                <div className="mt-10">

                    <h2 className="
                        text-xl
                        font-bold
                        text-slate-900
                    ">
                        Quick Actions
                    </h2>


                    <div className="
                        mt-6
                        flex
                        flex-wrap
                        gap-4
                    ">


                        <Link
                            to="/admin/courses"
                            className="
                                rounded-lg
                                bg-blue-600
                                px-5
                                py-3
                                text-sm
                                font-medium
                                text-white
                                transition
                                hover:bg-blue-700
                            "
                        >
                            Create Course
                        </Link>


                        <Link
                            to="/admin/modules"
                            className="
                                rounded-lg
                                border
                                border-slate-300
                                bg-white
                                px-5
                                py-3
                                text-sm
                                font-medium
                                text-slate-700
                                transition
                                hover:bg-slate-50
                            "
                        >
                            Add Module
                        </Link>


                        <Link
                            to="/admin/topics"
                            className="
                                rounded-lg
                                border
                                border-slate-300
                                bg-white
                                px-5
                                py-3
                                text-sm
                                font-medium
                                text-slate-700
                                transition
                                hover:bg-slate-50
                            "
                        >
                            Add Topic
                        </Link>


                        <Link
                            to="/admin/problems"
                            className="
                                rounded-lg
                                border
                                border-slate-300
                                bg-white
                                px-5
                                py-3
                                text-sm
                                font-medium
                                text-slate-700
                                transition
                                hover:bg-slate-50
                            "
                        >
                            Add Problem
                        </Link>


                        {/* =================================================
                            ADD STUDY MATERIAL - NEW
                        ================================================= */}

                        <Link
                            to="/admin/materials/add"
                            className="
                                rounded-lg
                                border
                                border-orange-300
                                bg-white
                                px-5
                                py-3
                                text-sm
                                font-medium
                                text-orange-600
                                transition
                                hover:bg-orange-50
                            "
                        >
                            Add Study Material
                        </Link>


                    </div>

                </div>


            </div>

        </div>

    );

};


export default AdminDashboard;