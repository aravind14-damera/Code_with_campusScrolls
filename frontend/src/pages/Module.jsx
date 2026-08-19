import { useNavigate, useParams } from "react-router-dom";

const Module = () => {
    const { moduleId } = useParams();
    const navigate = useNavigate();

    // Temporary module data.
    // Later we will fetch this from FastAPI.
    const module = {
        title: "Java Fundamentals",
        description:
            "Learn the fundamental concepts of Java programming step by step.",
        topics: [
            {
                id: "1",
                title: "Introduction to Java",
                description: "Learn what Java is and why it is widely used.",
                duration: "15 min",
            },
            {
                id: "2",
                title: "Variables and Data Types",
                description: "Understand variables, primitive types and values.",
                duration: "20 min",
            },
            {
                id: "3",
                title: "Operators",
                description: "Learn arithmetic, relational and logical operators.",
                duration: "20 min",
            },
            {
                id: "4",
                title: "Conditional Statements",
                description: "Learn if, else-if and switch statements.",
                duration: "25 min",
            },
        ],
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white">

            {/* Header */}
            <div className="border-b border-slate-800 bg-slate-950">

                <div className="max-w-6xl mx-auto px-6 py-10">

                    <button
                        onClick={() => navigate(-1)}
                        className="
                            mb-6
                            text-sm
                            text-slate-400
                            hover:text-white
                            transition
                        "
                    >
                        ← Back
                    </button>

                    <p className="text-indigo-400 text-sm font-semibold mb-3">
                        MODULE
                    </p>

                    <h1 className="text-4xl font-bold mb-4">
                        {module.title}
                    </h1>

                    <p className="text-slate-400 max-w-2xl leading-relaxed">
                        {module.description}
                    </p>

                    <div className="flex gap-6 mt-6 text-sm text-slate-400">
                        <span>
                            📚 {module.topics.length} Topics
                        </span>

                        <span>
                            🎯 Beginner Friendly
                        </span>
                    </div>

                </div>

            </div>

            {/* Topics */}
            <main className="max-w-6xl mx-auto px-6 py-10">

                <div className="mb-8">

                    <h2 className="text-2xl font-bold">
                        Topics
                    </h2>

                    <p className="text-slate-400 mt-2">
                        Complete each topic to continue your learning journey.
                    </p>

                </div>

                <div className="space-y-4">

                    {module.topics.map((topic, index) => (

                        <div
                            key={topic.id}
                            onClick={() =>
                                navigate(`/topics/${topic.id}`)
                            }
                            className="
                                group
                                bg-slate-900
                                border
                                border-slate-800
                                rounded-2xl
                                p-6
                                cursor-pointer
                                hover:border-indigo-500/60
                                hover:bg-slate-900/80
                                hover:-translate-y-1
                                transition-all
                                duration-300
                            "
                        >

                            <div className="flex items-center gap-5">

                                {/* Number */}
                                <div
                                    className="
                                        flex-shrink-0
                                        w-12
                                        h-12
                                        rounded-xl
                                        bg-indigo-500/10
                                        text-indigo-400
                                        flex
                                        items-center
                                        justify-center
                                        font-bold
                                        group-hover:bg-indigo-500
                                        group-hover:text-white
                                        transition
                                    "
                                >
                                    {index + 1}
                                </div>

                                {/* Content */}
                                <div className="flex-1">

                                    <h3
                                        className="
                                            text-lg
                                            font-semibold
                                            group-hover:text-indigo-400
                                            transition
                                        "
                                    >
                                        {topic.title}
                                    </h3>

                                    <p className="text-slate-400 text-sm mt-1">
                                        {topic.description}
                                    </p>

                                    <p className="text-slate-500 text-xs mt-3">
                                        ⏱ {topic.duration}
                                    </p>

                                </div>

                                {/* Arrow */}
                                <div
                                    className="
                                        text-slate-500
                                        text-xl
                                        group-hover:text-indigo-400
                                        group-hover:translate-x-1
                                        transition
                                    "
                                >
                                    →
                                </div>

                            </div>

                        </div>

                    ))}

                </div>

            </main>

        </div>
    );
};

export default Module;