import { useState } from "react";

const ManageProblems = () => {
    const [problems] = useState([
        {
            id: 1,
            title: "Two Sum",
            topic: "Arrays",
            difficulty: "Easy",
            status: "Published",
        },
        {
            id: 2,
            title: "Longest Substring Without Repeating Characters",
            topic: "Strings",
            difficulty: "Medium",
            status: "Published",
        },
        {
            id: 3,
            title: "Binary Tree Traversal",
            topic: "Trees",
            difficulty: "Medium",
            status: "Draft",
        },
    ]);

    const difficultyStyle = (difficulty) => {
        if (difficulty === "Easy") {
            return "bg-green-500/10 text-green-400";
        }

        if (difficulty === "Medium") {
            return "bg-yellow-500/10 text-yellow-400";
        }

        return "bg-red-500/10 text-red-400";
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white p-8">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">

                <div>
                    <p className="text-sm text-orange-400 font-medium mb-2">
                        ADMIN PANEL
                    </p>

                    <h1 className="text-4xl font-bold">
                        Manage Problems
                    </h1>

                    <p className="text-slate-400 mt-2">
                        Create and manage coding problems for your students.
                    </p>
                </div>

                <button
                    className="
                        bg-orange-600
                        hover:bg-orange-500
                        px-6 py-3
                        rounded-xl
                        font-semibold
                        transition-all
                        duration-300
                        hover:-translate-y-1
                        hover:shadow-lg
                        hover:shadow-orange-500/20
                    "
                >
                    + Add Problem
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
                        hover:border-orange-500/50
                        transition
                    "
                >
                    <p className="text-slate-400 text-sm">
                        Total Problems
                    </p>

                    <h2 className="text-3xl font-bold mt-2">
                        {problems.length}
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
                            problems.filter(
                                problem => problem.status === "Published"
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
                            problems.filter(
                                problem => problem.status === "Draft"
                            ).length
                        }
                    </h2>
                </div>

            </div>

            {/* Problems */}
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
                        All Problems
                    </h2>
                </div>

                <div className="divide-y divide-slate-800">

                    {problems.map((problem) => (

                        <div
                            key={problem.id}
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

                            {/* Problem Information */}
                            <div className="flex-1">

                                <div className="flex flex-wrap items-center gap-3">

                                    <h3 className="text-lg font-semibold">
                                        {problem.title}
                                    </h3>

                                    <span
                                        className={`
                                            text-xs
                                            px-3 py-1
                                            rounded-full
                                            ${difficultyStyle(
                                                problem.difficulty
                                            )}
                                        `}
                                    >
                                        {problem.difficulty}
                                    </span>

                                    <span
                                        className="
                                            text-xs
                                            px-3 py-1
                                            rounded-full
                                            bg-blue-500/10
                                            text-blue-400
                                        "
                                    >
                                        {problem.status}
                                    </span>

                                </div>

                                <p className="text-slate-400 mt-2">
                                    Topic:{" "}
                                    <span className="text-slate-300">
                                        {problem.topic}
                                    </span>
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

export default ManageProblems;