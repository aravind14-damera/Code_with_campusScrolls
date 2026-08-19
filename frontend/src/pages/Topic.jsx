import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";

const Topic = () => {
    const { topicId } = useParams();
    const navigate = useNavigate();

    const [completed, setCompleted] = useState(false);

    // Temporary topic data.
    // Later this will come from your FastAPI backend.
    const topic = {
        title: "Introduction to Java",
        module: "Java Fundamentals",
        description:
            "Learn the basics of Java programming, its features, execution process, and why Java is widely used in software development.",
        duration: "15 min",
        difficulty: "Beginner",
        content: [
            {
                heading: "What is Java?",
                text:
                    "Java is a high-level, object-oriented programming language designed to be portable, secure, and easy to use."
            },
            {
                heading: "Why Learn Java?",
                text:
                    "Java is widely used for backend development, enterprise applications, Android development, and many other software systems."
            },
            {
                heading: "How Java Works",
                text:
                    "Java source code is compiled into bytecode. The Java Virtual Machine (JVM) executes this bytecode, allowing Java programs to run on different platforms."
            }
        ]
    };

    const handleComplete = () => {
        setCompleted(true);
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

                    <p className="text-indigo-400 text-sm font-semibold mb-3">
                        {topic.module}
                    </p>

                    <div className="flex flex-wrap items-center gap-4">

                        <h1 className="text-3xl md:text-4xl font-bold">
                            {topic.title}
                        </h1>

                        {completed && (
                            <span
                                className="
                                    px-3
                                    py-1
                                    rounded-full
                                    bg-green-500/10
                                    text-green-400
                                    text-xs
                                    font-medium
                                "
                            >
                                ✓ Completed
                            </span>
                        )}

                    </div>

                    <p className="text-slate-400 mt-4 max-w-3xl leading-7">
                        {topic.description}
                    </p>

                    <div className="flex flex-wrap gap-5 mt-6 text-sm text-slate-400">

                        <span>
                            ⏱ {topic.duration}
                        </span>

                        <span>
                            📖 {topic.difficulty}
                        </span>

                    </div>

                </div>

            </header>

            {/* Main Content */}
            <main className="max-w-5xl mx-auto px-6 py-10">

                {/* Progress */}
                <div
                    className="
                        bg-slate-900
                        border
                        border-slate-800
                        rounded-2xl
                        p-6
                        mb-8
                    "
                >

                    <div className="flex justify-between items-center mb-3">

                        <span className="text-sm text-slate-400">
                            Topic Progress
                        </span>

                        <span className="text-sm font-semibold text-indigo-400">
                            {completed ? "100%" : "0%"}
                        </span>

                    </div>

                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">

                        <div
                            className="
                                h-full
                                bg-indigo-500
                                rounded-full
                                transition-all
                                duration-500
                            "
                            style={{
                                width: completed ? "100%" : "0%"
                            }}
                        />

                    </div>

                </div>

                {/* Learning Content */}
                <div className="space-y-6">

                    {topic.content.map((section, index) => (

                        <section
                            key={index}
                            className="
                                bg-slate-900
                                border
                                border-slate-800
                                rounded-2xl
                                p-7
                                hover:border-indigo-500/40
                                transition
                            "
                        >

                            <div className="flex items-start gap-4">

                                <div
                                    className="
                                        flex-shrink-0
                                        w-10
                                        h-10
                                        rounded-xl
                                        bg-indigo-500/10
                                        text-indigo-400
                                        flex
                                        items-center
                                        justify-center
                                        font-bold
                                    "
                                >
                                    {index + 1}
                                </div>

                                <div>

                                    <h2 className="text-xl font-semibold mb-3">
                                        {section.heading}
                                    </h2>

                                    <p className="text-slate-400 leading-7">
                                        {section.text}
                                    </p>

                                </div>

                            </div>

                        </section>

                    ))}

                </div>

                {/* Complete Button */}
                <div
                    className="
                        mt-10
                        bg-slate-900
                        border
                        border-slate-800
                        rounded-2xl
                        p-7
                    "
                >

                    {!completed ? (

                        <div className="flex flex-col sm:flex-row items-center justify-between gap-5">

                            <div>

                                <h3 className="text-lg font-semibold">
                                    Finished this topic?
                                </h3>

                                <p className="text-slate-400 text-sm mt-1">
                                    Mark this topic as completed to track your progress.
                                </p>

                            </div>

                            <button
                                onClick={handleComplete}
                                className="
                                    px-6
                                    py-3
                                    rounded-xl
                                    bg-indigo-600
                                    hover:bg-indigo-500
                                    transition
                                    font-semibold
                                    shadow-lg
                                    shadow-indigo-500/20
                                    whitespace-nowrap
                                "
                            >
                                Mark as Complete
                            </button>

                        </div>

                    ) : (

                        <div className="flex flex-col sm:flex-row items-center justify-between gap-5">

                            <div>

                                <h3 className="text-lg font-semibold text-green-400">
                                    ✓ Topic Completed
                                </h3>

                                <p className="text-slate-400 text-sm mt-1">
                                    Great work! Your progress has been updated.
                                </p>

                            </div>

                            <button
                                onClick={() => navigate(-1)}
                                className="
                                    px-6
                                    py-3
                                    rounded-xl
                                    bg-slate-800
                                    hover:bg-slate-700
                                    transition
                                    font-semibold
                                "
                            >
                                Back to Module
                            </button>

                        </div>

                    )}

                </div>

            </main>

        </div>
    );
};

export default Topic;