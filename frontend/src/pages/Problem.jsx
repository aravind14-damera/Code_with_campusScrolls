import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";

const Problem = () => {
    const { problemId } = useParams();
    const navigate = useNavigate();

    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [submitted, setSubmitted] = useState(false);

    // Temporary problem data.
    // Later we will fetch this from FastAPI.
    const problem = {
        title: "Two Sum",
        difficulty: "Easy",
        description:
            "Given an array of integers, find two numbers whose sum is equal to the target.",
        input:
            "nums = [2, 7, 11, 15], target = 9",
        output:
            "[0, 1]",
        explanation:
            "The numbers 2 and 7 add up to 9, so their indices are 0 and 1.",
        options: [
            "[0, 1]",
            "[1, 2]",
            "[0, 2]",
            "[2, 3]",
        ],
        correctAnswer: "[0, 1]",
    };

    const handleSubmit = () => {
        if (selectedAnswer === null) {
            return;
        }

        setSubmitted(true);
    };

    const getOptionStyle = (option) => {
        if (!submitted) {
            return selectedAnswer === option
                ? "border-indigo-500 bg-indigo-500/10"
                : "border-slate-800 hover:border-indigo-500/50";
        }

        if (option === problem.correctAnswer) {
            return "border-green-500 bg-green-500/10";
        }

        if (
            option === selectedAnswer &&
            option !== problem.correctAnswer
        ) {
            return "border-red-500 bg-red-500/10";
        }

        return "border-slate-800";
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white">

            {/* Header */}
            <header className="border-b border-slate-800">

                <div className="max-w-5xl mx-auto px-6 py-8">

                    <button
                        onClick={() => navigate(-1)}
                        className="
                            text-sm
                            text-slate-400
                            hover:text-white
                            transition
                            mb-6
                        "
                    >
                        ← Back
                    </button>

                    <div className="flex flex-wrap items-center gap-4">

                        <h1 className="text-3xl font-bold">
                            {problem.title}
                        </h1>

                        <span
                            className="
                                px-3
                                py-1
                                rounded-full
                                text-xs
                                font-medium
                                bg-green-500/10
                                text-green-400
                            "
                        >
                            {problem.difficulty}
                        </span>

                    </div>

                    <p className="text-slate-500 text-sm mt-3">
                        Problem ID: {problemId}
                    </p>

                </div>

            </header>

            {/* Main */}
            <main className="max-w-5xl mx-auto px-6 py-10">

                {/* Problem Description */}
                <section
                    className="
                        bg-slate-900
                        border
                        border-slate-800
                        rounded-2xl
                        p-7
                        mb-8
                    "
                >

                    <h2 className="text-xl font-semibold mb-4">
                        Problem Description
                    </h2>

                    <p className="text-slate-300 leading-7">
                        {problem.description}
                    </p>

                </section>

                {/* Example */}
                <section
                    className="
                        bg-slate-900
                        border
                        border-slate-800
                        rounded-2xl
                        p-7
                        mb-8
                    "
                >

                    <h2 className="text-xl font-semibold mb-6">
                        Example
                    </h2>

                    <div className="space-y-5">

                        <div>

                            <p className="text-sm text-slate-400 mb-2">
                                Input
                            </p>

                            <div
                                className="
                                    bg-slate-950
                                    border
                                    border-slate-800
                                    rounded-xl
                                    p-4
                                    font-mono
                                    text-indigo-300
                                "
                            >
                                {problem.input}
                            </div>

                        </div>

                        <div>

                            <p className="text-sm text-slate-400 mb-2">
                                Output
                            </p>

                            <div
                                className="
                                    bg-slate-950
                                    border
                                    border-slate-800
                                    rounded-xl
                                    p-4
                                    font-mono
                                    text-green-300
                                "
                            >
                                {problem.output}
                            </div>

                        </div>

                        <div>

                            <p className="text-sm text-slate-400 mb-2">
                                Explanation
                            </p>

                            <p className="text-slate-300 leading-7">
                                {problem.explanation}
                            </p>

                        </div>

                    </div>

                </section>

                {/* Answer */}
                <section
                    className="
                        bg-slate-900
                        border
                        border-slate-800
                        rounded-2xl
                        p-7
                    "
                >

                    <h2 className="text-xl font-semibold mb-2">
                        Choose your answer
                    </h2>

                    <p className="text-slate-400 text-sm mb-6">
                        Select the correct option.
                    </p>

                    <div className="space-y-3">

                        {problem.options.map((option, index) => (

                            <button
                                key={option}
                                disabled={submitted}
                                onClick={() =>
                                    setSelectedAnswer(option)
                                }
                                className={`
                                    w-full
                                    text-left
                                    border
                                    rounded-xl
                                    p-4
                                    transition-all
                                    duration-200
                                    ${getOptionStyle(option)}
                                    ${
                                        !submitted
                                            ? "cursor-pointer"
                                            : "cursor-default"
                                    }
                                `}
                            >

                                <div className="flex items-center gap-4">

                                    <span
                                        className="
                                            w-9
                                            h-9
                                            rounded-lg
                                            bg-slate-800
                                            flex
                                            items-center
                                            justify-center
                                            text-sm
                                            font-semibold
                                            text-slate-300
                                        "
                                    >
                                        {String.fromCharCode(65 + index)}
                                    </span>

                                    <span className="font-mono text-slate-200">
                                        {option}
                                    </span>

                                </div>

                            </button>

                        ))}

                    </div>

                    {/* Submit */}
                    {!submitted && (
                        <button
                            onClick={handleSubmit}
                            disabled={selectedAnswer === null}
                            className="
                                mt-7
                                w-full
                                py-3
                                rounded-xl
                                bg-indigo-600
                                hover:bg-indigo-500
                                disabled:bg-slate-800
                                disabled:text-slate-500
                                transition
                                font-semibold
                            "
                        >
                            Submit Answer
                        </button>
                    )}

                    {/* Result */}
                    {submitted && (

                        <div
                            className={`
                                mt-7
                                rounded-xl
                                p-5
                                border
                                ${
                                    selectedAnswer === problem.correctAnswer
                                        ? "border-green-500/30 bg-green-500/10"
                                        : "border-red-500/30 bg-red-500/10"
                                }
                            `}
                        >

                            <h3 className="font-semibold text-lg">

                                {selectedAnswer === problem.correctAnswer
                                    ? "🎉 Correct Answer!"
                                    : "❌ Incorrect Answer"}

                            </h3>

                            <p className="text-slate-400 text-sm mt-2">

                                {selectedAnswer === problem.correctAnswer
                                    ? "Great job! You solved the problem correctly."
                                    : `The correct answer is ${problem.correctAnswer}.`}

                            </p>

                        </div>

                    )}

                </section>

            </main>

        </div>
    );
};

export default Problem;