import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

const ManageProblems = () => {

    const navigate = useNavigate();

    const [problems, setProblems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    // =========================================================
    // GET TOKEN
    // =========================================================

    const getToken = () => {
        return localStorage.getItem("access_token");
    };


    // =========================================================
    // FETCH ALL PROBLEMS
    // =========================================================

    const fetchProblems = async () => {

        try {

            setLoading(true);
            setError("");

            const token = getToken();

            if (!token) {
                throw new Error(
                    "Authentication token not found. Please login again."
                );
            }

            const response = await fetch(
                `${API_URL}/admin/problems`,
                {
                    method: "GET",

                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();

            if (!response.ok) {

                throw new Error(
                    data.detail ||
                    "Failed to load problems"
                );
            }

            setProblems(
                Array.isArray(data)
                    ? data
                    : []
            );

        } catch (err) {

            console.error(
                "Error loading problems:",
                err
            );

            setError(
                err.message ||
                "Failed to load problems"
            );

        } finally {

            setLoading(false);

        }
    };


    // =========================================================
    // LOAD PROBLEMS
    // =========================================================

    useEffect(() => {

        fetchProblems();

    }, []);


    // =========================================================
    // DELETE PROBLEM
    // =========================================================

    const handleDelete = async (problemId) => {

        const confirmed = window.confirm(
            "Are you sure you want to permanently delete this problem?"
        );

        if (!confirmed) {
            return;
        }

        try {

            const token = getToken();

            if (!token) {

                throw new Error(
                    "Authentication token not found. Please login again."
                );
            }

            const response = await fetch(
                `${API_URL}/admin/problems/${problemId}`,
                {
                    method: "DELETE",

                    headers: {
                        Authorization:
                            `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();

            if (!response.ok) {

                throw new Error(
                    data.detail ||
                    "Failed to delete problem"
                );
            }


            // Remove deleted problem immediately
            setProblems((previousProblems) =>
                previousProblems.filter(
                    (problem) =>
                        String(problem.id) !==
                        String(problemId)
                )
            );


            alert(
                "Problem deleted successfully."
            );

        } catch (err) {

            console.error(
                "Delete problem error:",
                err
            );

            alert(
                err.message ||
                "Failed to delete problem"
            );

        }
    };


    // =========================================================
    // DIFFICULTY STYLE
    // =========================================================

    const difficultyStyle = (difficulty) => {

        if (difficulty === "Easy") {

            return "bg-green-100 text-green-700";

        }

        if (difficulty === "Medium") {

            return "bg-yellow-100 text-yellow-700";

        }

        return "bg-red-100 text-red-700";
    };


    // =========================================================
    // STATISTICS
    // =========================================================

    const totalProblems =
        problems.length;

    const publishedProblems =
        problems.filter(
            (problem) =>
                problem.is_published === true
        ).length;

    const draftProblems =
        problems.filter(
            (problem) =>
                problem.is_published === false
        ).length;


    // =========================================================
    // LOADING
    // =========================================================

    if (loading) {

        return (

            <div className="
                min-h-screen
                bg-white
                text-slate-900
                flex
                items-center
                justify-center
            ">

                <div className="text-center">

                    <div className="
                        w-10
                        h-10
                        border-4
                        border-slate-200
                        border-t-orange-600
                        rounded-full
                        animate-spin
                        mx-auto
                        mb-4
                    " />

                    <p className="text-slate-500">
                        Loading problems...
                    </p>

                </div>

            </div>

        );
    }


    // =========================================================
    // MAIN UI
    // =========================================================

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
                        text-orange-600
                        font-medium
                        mb-2
                    ">
                        ADMIN PANEL
                    </p>


                    <h1 className="
                        text-4xl
                        font-bold
                        text-slate-900
                    ">
                        Manage Problems
                    </h1>


                    <p className="
                        text-slate-500
                        mt-2
                    ">
                        Create and manage coding
                        problems for your students.
                    </p>

                </div>


                <button
                    onClick={() =>
                        navigate("/admin/problems/add")
                    }
                    className="
                        bg-orange-600
                        hover:bg-orange-500
                        text-white
                        px-6
                        py-3
                        rounded-xl
                        font-semibold
                        transition
                        duration-300
                        hover:-translate-y-1
                        hover:shadow-lg
                        hover:shadow-orange-500/20
                    "
                >
                    + Add Problem
                </button>

            </div>


            {/* =================================================
                ERROR
            ================================================= */}

            {error && (

                <div className="
                    mb-6
                    bg-red-50
                    border
                    border-red-200
                    text-red-600
                    rounded-xl
                    p-4
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
                md:grid-cols-3
                gap-6
                mb-10
            ">


                {/* TOTAL PROBLEMS */}

                <div className="
                    bg-white
                    border
                    border-slate-200
                    rounded-2xl
                    p-6
                    shadow-sm
                    hover:shadow-md
                    transition
                ">

                    <p className="
                        text-slate-500
                        text-sm
                    ">
                        Total Problems
                    </p>

                    <h2 className="
                        text-3xl
                        font-bold
                        mt-2
                        text-slate-900
                    ">
                        {totalProblems}
                    </h2>

                </div>


                {/* PUBLISHED */}

                <div className="
                    bg-white
                    border
                    border-slate-200
                    rounded-2xl
                    p-6
                    shadow-sm
                    hover:shadow-md
                    transition
                ">

                    <p className="
                        text-slate-500
                        text-sm
                    ">
                        Published
                    </p>

                    <h2 className="
                        text-3xl
                        font-bold
                        mt-2
                        text-green-600
                    ">
                        {publishedProblems}
                    </h2>

                </div>


                {/* DRAFTS */}

                <div className="
                    bg-white
                    border
                    border-slate-200
                    rounded-2xl
                    p-6
                    shadow-sm
                    hover:shadow-md
                    transition
                ">

                    <p className="
                        text-slate-500
                        text-sm
                    ">
                        Drafts
                    </p>

                    <h2 className="
                        text-3xl
                        font-bold
                        mt-2
                        text-yellow-600
                    ">
                        {draftProblems}
                    </h2>

                </div>

            </div>


            {/* =================================================
                ALL PROBLEMS
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
                        text-slate-900
                    ">
                        All Problems
                    </h2>

                    <p className="
                        text-slate-500
                        mt-1
                    ">
                        Manage your coding problems.
                    </p>

                </div>


                {/* =================================================
                    EMPTY STATE
                ================================================= */}

                {problems.length === 0 && (

                    <div className="
                        p-12
                        text-center
                        text-slate-500
                    ">

                        <p className="
                            text-lg
                            font-medium
                            text-slate-700
                        ">
                            No problems found
                        </p>

                        <p className="
                            mt-2
                            text-sm
                        ">
                            Click "Add Problem" to create
                            your first coding problem.
                        </p>

                    </div>

                )}


                {/* =================================================
                    PROBLEM LIST
                ================================================= */}

                <div className="
                    divide-y
                    divide-slate-200
                ">

                    {problems.map(
                        (problem) => (

                            <div
                                key={problem.id}
                                className="
                                    p-6
                                    flex
                                    flex-col
                                    lg:flex-row
                                    lg:items-center
                                    lg:justify-between
                                    gap-6
                                    hover:bg-slate-50
                                    transition
                                "
                            >


                                {/* =================================================
                                    PROBLEM INFORMATION
                                ================================================= */}

                                <div className="flex-1">

                                    <div className="
                                        flex
                                        flex-wrap
                                        items-center
                                        gap-3
                                    ">


                                        {/* TITLE */}

                                        <h3 className="
                                            text-lg
                                            font-semibold
                                            text-slate-900
                                        ">
                                            {problem.title}
                                        </h3>


                                        {/* DIFFICULTY */}

                                        <span className={`
                                            text-xs
                                            px-3
                                            py-1
                                            rounded-full
                                            font-medium
                                            ${difficultyStyle(
                                                problem.difficulty
                                            )}
                                        `}>

                                            {problem.difficulty}

                                        </span>


                                        {/* STATUS */}

                                        <span className={`
                                            text-xs
                                            px-3
                                            py-1
                                            rounded-full
                                            font-medium
                                            ${
                                                problem.is_published
                                                    ? "bg-blue-100 text-blue-700"
                                                    : "bg-yellow-100 text-yellow-700"
                                            }
                                        `}>

                                            {problem.is_published
                                                ? "Published"
                                                : "Draft"}

                                        </span>

                                    </div>


                                    {/* TOPIC */}

                                    <p className="
                                        text-slate-500
                                        mt-2
                                    ">

                                        Topic:{" "}

                                        <span className="
                                            text-slate-700
                                            font-medium
                                        ">

                                            {problem.topic ||
                                                "Unknown Topic"}

                                        </span>

                                    </p>


                                    {/* ORDER */}

                                    <p className="
                                        text-slate-400
                                        mt-2
                                        text-sm
                                    ">

                                        Order:{" "}

                                        <span className="
                                            text-slate-600
                                        ">
                                            {problem.order || 1}
                                        </span>

                                    </p>


                                    {/* =================================================
                                        PDF
                                    ================================================= */}

                                    {problem.pdf_url && (

                                        <button
                                            onClick={() =>
                                                window.open(
                                                    problem.pdf_url,
                                                    "_blank",
                                                    "noopener,noreferrer"
                                                )
                                            }
                                            className="
                                                mt-4
                                                text-orange-600
                                                hover:text-orange-700
                                                font-medium
                                                text-sm
                                            "
                                        >

                                            📄 View Problem PDF →

                                        </button>

                                    )}

                                </div>


                                {/* =================================================
                                    ACTIONS
                                ================================================= */}

                                <div className="
                                    flex
                                    gap-3
                                ">


                                    {/* EDIT */}

                                    <button
                                        onClick={() =>
                                            navigate(
                                                `/admin/problems/edit/${problem.id}`
                                            )
                                        }
                                        className="
                                            px-4
                                            py-2
                                            rounded-lg
                                            bg-slate-100
                                            text-slate-700
                                            hover:bg-slate-200
                                            transition
                                            font-medium
                                        "
                                    >

                                        Edit

                                    </button>


                                    {/* DELETE */}

                                    <button
                                        onClick={() =>
                                            handleDelete(
                                                problem.id
                                            )
                                        }
                                        className="
                                            px-4
                                            py-2
                                            rounded-lg
                                            bg-red-50
                                            text-red-600
                                            hover:bg-red-100
                                            transition
                                            font-medium
                                        "
                                    >

                                        Delete

                                    </button>

                                </div>

                            </div>

                        )
                    )}

                </div>

            </div>

        </div>
    );
};


export default ManageProblems;