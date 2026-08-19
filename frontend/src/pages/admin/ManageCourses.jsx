import { useState } from "react";

const ManageCourses = () => {
    const [courses] = useState([
        {
            id: 1,
            title: "Java Programming",
            description: "Learn Java from basics to advanced concepts.",
            topics: 24,
            status: "Published",
        },
        {
            id: 2,
            title: "Data Structures & Algorithms",
            description: "Master DSA with practical coding problems.",
            topics: 32,
            status: "Published",
        },
        {
            id: 3,
            title: "SQL & DBMS",
            description: "Learn databases, SQL queries and DBMS concepts.",
            topics: 20,
            status: "Draft",
        },
    ]);

    return (
        <div className="min-h-screen bg-slate-950 text-white p-8">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">

                <div>
                    <p className="text-sm text-blue-400 font-medium mb-2">
                        ADMIN PANEL
                    </p>

                    <h1 className="text-4xl font-bold">
                        Manage Courses
                    </h1>

                    <p className="text-slate-400 mt-2">
                        Create, edit and manage your learning courses.
                    </p>
                </div>

                <button
                    className="
                        bg-blue-600
                        hover:bg-blue-500
                        px-6 py-3
                        rounded-xl
                        font-semibold
                        transition-all
                        duration-300
                        hover:-translate-y-1
                        hover:shadow-lg
                        hover:shadow-blue-500/20
                    "
                >
                    + Add Course
                </button>

            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-blue-500/50 transition">
                    <p className="text-slate-400 text-sm">
                        Total Courses
                    </p>

                    <h2 className="text-3xl font-bold mt-2">
                        {courses.length}
                    </h2>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-green-500/50 transition">
                    <p className="text-slate-400 text-sm">
                        Published
                    </p>

                    <h2 className="text-3xl font-bold mt-2 text-green-400">
                        {courses.filter(
                            course => course.status === "Published"
                        ).length}
                    </h2>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-yellow-500/50 transition">
                    <p className="text-slate-400 text-sm">
                        Drafts
                    </p>

                    <h2 className="text-3xl font-bold mt-2 text-yellow-400">
                        {courses.filter(
                            course => course.status === "Draft"
                        ).length}
                    </h2>
                </div>

            </div>

            {/* Courses */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">

                <div className="p-6 border-b border-slate-800">
                    <h2 className="text-xl font-semibold">
                        All Courses
                    </h2>
                </div>

                <div className="divide-y divide-slate-800">

                    {courses.map((course) => (

                        <div
                            key={course.id}
                            className="
                                p-6
                                flex flex-col lg:flex-row
                                lg:items-center
                                lg:justify-between
                                gap-6
                                hover:bg-slate-800/50
                                transition
                            "
                        >

                            <div className="flex-1">

                                <div className="flex items-center gap-3">

                                    <h3 className="text-lg font-semibold">
                                        {course.title}
                                    </h3>

                                    <span
                                        className={`
                                            text-xs
                                            px-3 py-1
                                            rounded-full
                                            ${
                                                course.status === "Published"
                                                    ? "bg-green-500/10 text-green-400"
                                                    : "bg-yellow-500/10 text-yellow-400"
                                            }
                                        `}
                                    >
                                        {course.status}
                                    </span>

                                </div>

                                <p className="text-slate-400 mt-2">
                                    {course.description}
                                </p>

                                <p className="text-sm text-slate-500 mt-3">
                                    {course.topics} topics
                                </p>

                            </div>

                            <div className="flex gap-3">

                                <button
                                    className="
                                        px-4 py-2
                                        rounded-lg
                                        bg-slate-800
                                        hover:bg-slate-700
                                        transition
                                    "
                                >
                                    Edit
                                </button>

                                <button
                                    className="
                                        px-4 py-2
                                        rounded-lg
                                        bg-red-500/10
                                        text-red-400
                                        hover:bg-red-500/20
                                        transition
                                    "
                                >
                                    Delete
                                </button>

                            </div>

                        </div>

                    ))}

                </div>

            </div>

        </div>
    );
};

export default ManageCourses;