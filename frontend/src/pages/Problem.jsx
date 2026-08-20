import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const API_URL = "http://localhost:8000";

const Problem = () => {
    const { problemId } = useParams();
    const navigate = useNavigate();

    const [problem, setProblem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProblem = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await axios.get(
                    `${API_URL}/problems/${problemId}`
                );

                console.log("Problem:", response.data);

                setProblem(response.data);
            } catch (err) {
                console.error("Problem error:", err);
                setError("Unable to load this problem. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        if (problemId) {
            fetchProblem();
        }
    }, [problemId]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-slate-600">Loading problem...</p>
            </div>
        );
    }

    if (error || !problem) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-slate-900">
                        {error || "Problem not found"}
                    </h1>

                    <button
                        onClick={() => navigate(-1)}
                        className="mt-6 px-5 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        ← Go Back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 py-10">

            <div className="max-w-5xl mx-auto px-6">

                {/* BACK */}
                <button
                    onClick={() => navigate(-1)}
                    className="mb-8 text-blue-600 hover:text-blue-800"
                >
                    ← Back to Problems
                </button>

                {/* PROBLEM */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">

                    <div className="flex items-center gap-3 mb-4">

                        <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                                problem.difficulty === "Easy"
                                    ? "bg-green-100 text-green-700"
                                    : problem.difficulty === "Medium"
                                    ? "bg-yellow-100 text-yellow-700"
                                    : "bg-red-100 text-red-700"
                            }`}
                        >
                            {problem.difficulty}
                        </span>

                        <span className="text-slate-400">
                            Problem {problem.order}
                        </span>

                    </div>

                    <h1 className="text-3xl font-bold text-slate-900">
                        {problem.title}
                    </h1>

                    <div className="mt-8">

                        <h2 className="text-xl font-bold text-slate-900">
                            Problem
                        </h2>

                        <p className="mt-4 text-slate-600 leading-7">
                            {problem.description}
                        </p>

                    </div>

                </div>

                {/* PDF */}
                <section className="mt-8">

                    <h2 className="text-xl font-bold text-slate-900 mb-4">
                        Problem PDF
                    </h2>

                    {problem.pdf_url ? (

                        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">

                            {/* PDF VIEWER */}
                            <div className="w-full h-[800px] bg-slate-100">

                                <iframe
                                    src={problem.pdf_url}
                                    title={`${problem.title} PDF`}
                                    className="w-full h-full border-0"
                                />

                            </div>

                            {/* OPEN PDF */}
                            <div className="p-5 flex justify-end border-t border-slate-200">

                                <a
                                    href={problem.pdf_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-5 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
                                >
                                    📄 Open PDF
                                </a>

                            </div>

                        </div>

                    ) : (

                        <div className="bg-white border border-slate-200 rounded-xl p-6 text-slate-500">
                            Problem PDF is not available.
                        </div>

                    )}

                </section>

            </div>

        </div>
    );
};

export default Problem;