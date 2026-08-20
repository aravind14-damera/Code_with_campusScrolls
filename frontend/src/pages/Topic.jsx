import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:8000";

const Topic = () => {
    const { topicId } = useParams();

    const [topic, setTopic] = useState(null);
    const [materials, setMaterials] = useState([]);
    const [problems, setProblems] = useState([]);

    const [selectedProblem, setSelectedProblem] = useState(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchTopicData = async () => {
            try {
                setLoading(true);
                setError("");

                const topicResponse = await axios.get(
                    `${API_URL}/topics/${topicId}`
                );

                const materialsResponse = await axios.get(
                    `${API_URL}/materials/topic/${topicId}`
                );

                const problemsResponse = await axios.get(
                    `${API_URL}/problems/topic/${topicId}`
                );

                console.log("Topic:", topicResponse.data);
                console.log("Materials:", materialsResponse.data);
                console.log("Problems:", problemsResponse.data);

                setTopic(topicResponse.data);

                setMaterials(
                    Array.isArray(materialsResponse.data)
                        ? materialsResponse.data
                        : []
                );

                setProblems(
                    Array.isArray(problemsResponse.data)
                        ? problemsResponse.data
                        : []
                );
            } catch (err) {
                console.error("Topic error:", err);

                if (err.response?.status === 404) {
                    setError("Topic not found.");
                } else if (err.response?.status === 400) {
                    setError("Invalid topic ID.");
                } else {
                    setError(
                        "Unable to load this topic. Please try again."
                    );
                }
            } finally {
                setLoading(false);
            }
        };

        if (topicId) {
            fetchTopicData();
        }
    }, [topicId]);

    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {
        return (
            <main className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="text-center">
                    <div
                        className="
                            mx-auto
                            h-9
                            w-9
                            animate-spin
                            rounded-full
                            border-4
                            border-slate-200
                            border-t-blue-600
                        "
                    />

                    <p className="mt-4 text-sm text-slate-500">
                        Loading topic...
                    </p>
                </div>
            </main>
        );
    }

    // =====================================================
    // ERROR
    // =====================================================

    if (error) {
        return (
            <main className="min-h-screen bg-slate-50 flex items-center justify-center px-6">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-slate-900">
                        {error}
                    </h1>

                    <p className="mt-2 text-slate-500">
                        Please try again later.
                    </p>

                    <Link
                        to="/courses"
                        className="
                            mt-6
                            inline-block
                            rounded-xl
                            bg-blue-600
                            px-5
                            py-3
                            text-sm
                            font-semibold
                            text-white
                            hover:bg-blue-700
                        "
                    >
                        ← Back to Courses
                    </Link>
                </div>
            </main>
        );
    }

    // =====================================================
    // SELECTED PROBLEM
    // =====================================================

    if (selectedProblem) {
        return (
            <main className="min-h-screen bg-slate-50">
                <div className="mx-auto max-w-5xl px-6 py-10">

                    {/* BACK */}
                    <button
                        onClick={() => setSelectedProblem(null)}
                        className="
                            mb-8
                            text-sm
                            font-medium
                            text-blue-600
                            hover:text-blue-800
                        "
                    >
                        ← Back to Problems
                    </button>

                    {/* PROBLEM */}
                    <section
                        className="
                            rounded-2xl
                            border
                            border-slate-200
                            bg-white
                            p-8
                            shadow-sm
                        "
                    >
                        <div className="flex items-center gap-3 mb-5">

                            <span
                                className={`
                                    rounded-full
                                    px-3
                                    py-1
                                    text-xs
                                    font-semibold
                                    ${
                                        selectedProblem.difficulty
                                            ?.toLowerCase() === "easy"
                                            ? "bg-green-100 text-green-700"
                                            : selectedProblem.difficulty
                                                ?.toLowerCase() === "medium"
                                                ? "bg-yellow-100 text-yellow-700"
                                                : "bg-red-100 text-red-700"
                                    }
                                `}
                            >
                                {selectedProblem.difficulty}
                            </span>

                            <span className="text-sm text-slate-400">
                                Problem {selectedProblem.order}
                            </span>

                        </div>

                        <h1 className="text-4xl font-bold text-slate-900">
                            {selectedProblem.title}
                        </h1>

                        <div className="mt-8">

                            <h2 className="text-xl font-bold text-slate-900">
                                Problem
                            </h2>

                            <p className="mt-4 text-slate-600 leading-7">
                                {selectedProblem.description}
                            </p>

                        </div>
                    </section>

                    {/* =====================================================
                        PROBLEM PDF
                    ===================================================== */}

                    <section className="mt-8">

                        <h2 className="text-2xl font-bold text-slate-900 mb-4">
                            Problem PDF
                        </h2>

                        {selectedProblem.pdf_url ? (

                            <div
                                className="
                                    overflow-hidden
                                    rounded-2xl
                                    border
                                    border-slate-200
                                    bg-white
                                    shadow-sm
                                "
                            >

                                {/* PDF VIEWER */}

                                <div className="w-full h-[800px] bg-slate-100">

                                    <iframe
                                        src={selectedProblem.pdf_url}
                                        title={`${selectedProblem.title} PDF`}
                                        className="w-full h-full border-0"
                                    />

                                </div>

                                {/* OPEN PDF */}

                                <div
                                    className="
                                        flex
                                        justify-end
                                        border-t
                                        border-slate-200
                                        p-5
                                    "
                                >

                                    <a
                                        href={selectedProblem.pdf_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="
                                            rounded-xl
                                            bg-blue-600
                                            px-5
                                            py-3
                                            text-sm
                                            font-semibold
                                            text-white
                                            hover:bg-blue-700
                                        "
                                    >
                                        📄 Open PDF
                                    </a>

                                </div>

                            </div>

                        ) : (

                            <div
                                className="
                                    rounded-2xl
                                    border
                                    border-slate-200
                                    bg-white
                                    p-8
                                    text-center
                                "
                            >
                                <p className="text-slate-500">
                                    Problem PDF is not available.
                                </p>
                            </div>

                        )}

                    </section>

                </div>
            </main>
        );
    }

    // =====================================================
    // TOPIC PAGE
    // =====================================================

    return (
        <main className="min-h-screen bg-slate-50">

            <div className="mx-auto max-w-5xl px-6 py-10">

                {/* BACK */}

                <Link
                    to={`/modules/${topic.module_id}`}
                    className="
                        text-sm
                        font-medium
                        text-blue-600
                        hover:text-blue-700
                    "
                >
                    ← Back to Module
                </Link>

                {/* TOPIC HEADER */}

                <section
                    className="
                        mt-6
                        rounded-2xl
                        border
                        border-slate-200
                        bg-white
                        p-7
                        shadow-sm
                    "
                >

                    <p className="text-sm font-semibold text-blue-600">
                        TOPIC {topic.order}
                    </p>

                    <h1 className="mt-2 text-3xl font-bold text-slate-900">
                        {topic.title}
                    </h1>

                    <p className="mt-3 max-w-3xl leading-7 text-slate-600">
                        {topic.description}
                    </p>

                    {topic.youtube_url && (
                        <a
                            href={topic.youtube_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="
                                mt-5
                                inline-flex
                                items-center
                                rounded-xl
                                border
                                border-slate-200
                                bg-white
                                px-4
                                py-2.5
                                text-sm
                                font-semibold
                                text-slate-700
                                hover:bg-slate-50
                            "
                        >
                            ▶ Watch Video
                        </a>
                    )}

                </section>

                {/* =====================================================
                    STUDY MATERIAL
                ===================================================== */}

                <section className="mt-10">

                    <div className="mb-5">

                        <h2 className="text-2xl font-bold text-slate-900">
                            Study Material
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Read the study material before solving problems.
                        </p>

                    </div>

                    {materials.length === 0 ? (

                        <div
                            className="
                                rounded-2xl
                                border
                                border-slate-200
                                bg-white
                                p-8
                                text-center
                            "
                        >
                            <p className="text-slate-500">
                                No study material available yet.
                            </p>
                        </div>

                    ) : (

                        <div className="space-y-4">

                            {materials.map((material) => (

                                <div
                                    key={material.id}
                                    className="
                                        flex
                                        items-center
                                        justify-between
                                        gap-4
                                        rounded-2xl
                                        border
                                        border-slate-200
                                        bg-white
                                        p-5
                                        shadow-sm
                                    "
                                >

                                    <div className="flex items-center gap-4">

                                        <div
                                            className="
                                                flex
                                                h-12
                                                w-12
                                                shrink-0
                                                items-center
                                                justify-center
                                                rounded-xl
                                                bg-red-50
                                                text-xl
                                            "
                                        >
                                            📚
                                        </div>

                                        <div>

                                            <h3 className="font-semibold text-slate-900">
                                                {material.title}
                                            </h3>

                                            <p className="mt-1 text-sm text-slate-500">
                                                Study Material
                                            </p>

                                        </div>

                                    </div>

                                    <a
                                        href={material.file_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="
                                            shrink-0
                                            rounded-xl
                                            bg-blue-600
                                            px-4
                                            py-2.5
                                            text-sm
                                            font-semibold
                                            text-white
                                            hover:bg-blue-700
                                        "
                                    >
                                        View PDF →
                                    </a>

                                </div>

                            ))}

                        </div>

                    )}

                </section>

                {/* =====================================================
                    PROBLEMS
                ===================================================== */}

                <section className="mt-10">

                    <div className="mb-5">

                        <h2 className="text-2xl font-bold text-slate-900">
                            Problems
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Practice the problems below.
                        </p>

                    </div>

                    {problems.length === 0 ? (

                        <div
                            className="
                                rounded-2xl
                                border
                                border-slate-200
                                bg-white
                                p-8
                                text-center
                            "
                        >
                            <p className="text-slate-500">
                                No problems available yet.
                            </p>
                        </div>

                    ) : (

                        <div className="space-y-3">

                            {problems.map((problem, index) => (

                                <button
                                    key={problem.id}
                                    onClick={() =>
                                        setSelectedProblem(problem)
                                    }
                                    className="
                                        group
                                        flex
                                        w-full
                                        items-center
                                        gap-4
                                        rounded-2xl
                                        border
                                        border-slate-200
                                        bg-white
                                        p-5
                                        text-left
                                        shadow-sm
                                        transition
                                        hover:border-blue-300
                                        hover:shadow-md
                                    "
                                >

                                    <div
                                        className="
                                            flex
                                            h-10
                                            w-10
                                            shrink-0
                                            items-center
                                            justify-center
                                            rounded-xl
                                            bg-slate-100
                                            text-sm
                                            font-bold
                                            text-slate-600
                                            group-hover:bg-blue-600
                                            group-hover:text-white
                                        "
                                    >
                                        {index + 1}
                                    </div>

                                    <div className="min-w-0 flex-1">

                                        <h3 className="font-semibold text-slate-900">
                                            {problem.title}
                                        </h3>

                                        <p
                                            className="
                                                mt-1
                                                truncate
                                                text-sm
                                                text-slate-500
                                            "
                                        >
                                            {problem.description}
                                        </p>

                                    </div>

                                    <span
                                        className={`
                                            hidden
                                            rounded-full
                                            px-3
                                            py-1
                                            text-xs
                                            font-semibold
                                            sm:block
                                            ${
                                                problem.difficulty
                                                    ?.toLowerCase() === "easy"
                                                    ? "bg-green-100 text-green-700"
                                                    : problem.difficulty
                                                        ?.toLowerCase() === "medium"
                                                        ? "bg-yellow-100 text-yellow-700"
                                                        : "bg-red-100 text-red-700"
                                            }
                                        `}
                                    >
                                        {problem.difficulty}
                                    </span>

                                    <span className="text-lg text-slate-400">
                                        →
                                    </span>

                                </button>

                            ))}

                        </div>

                    )}

                </section>

            </div>

        </main>
    );
};

export default Topic;