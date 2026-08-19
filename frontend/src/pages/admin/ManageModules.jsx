import { useState } from "react";

const ManageModules = () => {
    const [modules] = useState([
        {
            id: 1,
            title: "Java Basics",
            course: "Java Programming",
            topics: 8,
            status: "Published",
        },
        {
            id: 2,
            title: "Object Oriented Programming",
            course: "Java Programming",
            topics: 10,
            status: "Published",
        },
        {
            id: 3,
            title: "Arrays & Strings",
            course: "Data Structures & Algorithms",
            topics: 12,
            status: "Published",
        },
        {
            id: 4,
            title: "SQL Basics",
            course: "SQL & DBMS",
            topics: 7,
            status: "Draft",
        },
    ]);

    return (
        <div className="min-h-screen bg-slate-950 text-white p-8">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">

                <div>
                    <p className="text-sm text-purple-400 font-medium mb-2">
                        ADMIN PANEL
                    </p>

                    <h1 className="text-4xl font-bold">
                        Manage Modules
                    </h1>

                    <p className="text-slate-400 mt-2">
                        Organize modules inside your courses.
                    </p>
                </div>

                <button
                    className="
                        bg-purple-600
                        hover:bg-purple-500
                        px-6 py-3
                        rounded-xl
                        font-semibold
                        transition-all
                        duration-300
                        hover:-translate-y-1
                        hover:shadow-lg
                        hover:shadow-purple-500/20
                    "
                >
                    + Add Module
                </button>

            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">

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
                        Total Modules
                    </p>

                    <h2 className="text-3xl font-bold mt-2">
                        {modules.length}
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
                        Published
                    </p>

                    <h2 className="text-3xl font-bold mt-2 text-green-400">
                        {
                            modules.filter(
                                module => module.status === "Published"
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
                        hover:border-yellow-500/50
                        transition
                    "
                >
                    <p className="text-slate-400 text-sm">
                        Drafts
                    </p>

                    <h2 className="text-3xl font-bold mt-2 text-yellow-400">
                        {
                            modules.filter(
                                module => module.status === "Draft"
                            ).length
                        }
                    </h2>
                </div>

            </div>

            {/* Module List */}
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
                        All Modules
                    </h2>
                </div>

                <div className="divide-y divide-slate-800">

                    {modules.map((module) => (

                        <div
                            key={module.id}
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

                                <div className="flex flex-wrap items-center gap-3">

                                    <h3 className="text-lg font-semibold">
                                        {module.title}
                                    </h3>

                                    <span
                                        className={`
                                            text-xs
                                            px-3 py-1
                                            rounded-full
                                            ${
                                                module.status === "Published"
                                                    ? "bg-green-500/10 text-green-400"
                                                    : "bg-yellow-500/10 text-yellow-400"
                                            }
                                        `}
                                    >
                                        {module.status}
                                    </span>

                                </div>

                                <p className="text-slate-400 mt-2">
                                    Course:{" "}
                                    <span className="text-slate-300">
                                        {module.course}
                                    </span>
                                </p>

                                <p className="text-sm text-slate-500 mt-3">
                                    {module.topics} topics
                                </p>

                            </div>

                            {/* Actions */}
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

export default ManageModules;