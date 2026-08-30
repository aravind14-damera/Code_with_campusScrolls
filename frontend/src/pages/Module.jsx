import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const Module = () => {
    const { moduleId } = useParams();

    const [module, setModule] = useState(null);
    const [topics, setTopics] = useState([]);

    const [loading, setLoading] = useState(true);
    const [topicsLoading, setTopicsLoading] = useState(true);

    const [error, setError] = useState("");
    const [topicsError, setTopicsError] = useState("");

    // =====================================================
    // FETCH MODULE + TOPICS
    // =====================================================

    useEffect(() => {
        if (!moduleId) {
            setError("Module ID is missing.");
            setLoading(false);
            setTopicsLoading(false);
            return;
        }

        const fetchModuleData = async () => {
            try {
                setLoading(true);
                setTopicsLoading(true);

                setError("");
                setTopicsError("");

                // -----------------------------------------
                // Get module
                // -----------------------------------------

                const moduleResponse = await axios.get(
                    `${API_URL}/modules/${moduleId}`
                );

                setModule(moduleResponse.data);

                // -----------------------------------------
                // Get topics belonging to this module
                // -----------------------------------------

                const topicsResponse = await axios.get(
                    `${API_URL}/topics/module/${moduleId}`
                );

                setTopics(topicsResponse.data);

            } catch (err) {
                console.error("Module / Topic error:", err);

                if (err.response?.config?.url?.includes("/topics/")) {
                    if (err.response?.status === 404) {
                        setTopicsError("No topics found for this module.");
                    } else if (err.response?.status === 400) {
                        setTopicsError("Invalid module ID.");
                    } else {
                        setTopicsError(
                            "Unable to load topics. Please try again."
                        );
                    }
                } else {
                    if (err.response?.status === 404) {
                        setError("Module not found.");
                    } else if (err.response?.status === 400) {
                        setError("Invalid module ID.");
                    } else {
                        setError(
                            "Unable to load the module. Please try again."
                        );
                    }
                }

            } finally {
                setLoading(false);
                setTopicsLoading(false);
            }
        };

        fetchModuleData();

    }, [moduleId]);


    // =====================================================
    // LOADING MODULE
    // =====================================================

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-50">

                <div className="text-center">

                    <div
                        className="
                            mx-auto
                            h-10
                            w-10
                            animate-spin
                            rounded-full
                            border-4
                            border-slate-200
                            border-t-blue-600
                        "
                    />

                    <p className="mt-4 text-sm text-slate-500">
                        Loading module...
                    </p>

                </div>

            </div>
        );
    }


    // =====================================================
    // MODULE ERROR
    // =====================================================

    if (error || !module) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6">

                <div className="max-w-md text-center">

                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-2xl">
                        !
                    </div>

                    <h1 className="mt-5 text-2xl font-bold text-slate-900">
                        {error || "Module not found"}
                    </h1>

                    <p className="mt-2 text-slate-500">
                        We couldn't load this module.
                    </p>

                    <Link
                        to="/courses"
                        className="
                            mt-6
                            inline-flex
                            items-center
                            rounded-xl
                            bg-blue-600
                            px-5
                            py-3
                            font-semibold
                            text-white
                            transition
                            hover:bg-blue-700
                        "
                    >
                        ← Back to Courses
                    </Link>

                </div>

            </div>
        );
    }


    // =====================================================
    // MAIN PAGE
    // =====================================================

    return (
        <main className="min-h-screen bg-slate-50">

            <div className="mx-auto max-w-5xl px-6 py-10 md:py-14">

                {/* =================================================
                    BACK TO COURSE
                ================================================= */}

                <Link
                    to={`/courses/${module.course_id}`}
                    className="
                        inline-flex
                        items-center
                        gap-2
                        text-sm
                        font-medium
                        text-slate-500
                        transition
                        hover:text-blue-600
                    "
                >
                    ← Back to course
                </Link>


                {/* =================================================
                    MODULE HEADER
                ================================================= */}

                <section
                    className="
                        mt-6
                        overflow-hidden
                        rounded-3xl
                        border
                        border-slate-200
                        bg-white
                        shadow-sm
                    "
                >

                    <div className="p-7 md:p-10">

                        {/* Module number */}

                        <div className="flex items-center gap-3">

                            <span
                                className="
                                    inline-flex
                                    h-9
                                    min-w-9
                                    items-center
                                    justify-center
                                    rounded-lg
                                    bg-blue-50
                                    px-3
                                    text-sm
                                    font-bold
                                    text-blue-600
                                "
                            >
                                {module.order}
                            </span>

                            <span className="text-sm font-medium text-slate-500">
                                Module
                            </span>

                        </div>


                        {/* Title */}

                        <h1
                            className="
                                mt-5
                                text-3xl
                                font-bold
                                tracking-tight
                                text-slate-900
                                md:text-4xl
                            "
                        >
                            {module.title}
                        </h1>


                        {/* Description */}

                        <p
                            className="
                                mt-4
                                max-w-3xl
                                text-base
                                leading-7
                                text-slate-600
                            "
                        >
                            {module.description}
                        </p>


                        {/* Simple stats */}

                        <div
                            className="
                                mt-7
                                flex
                                flex-wrap
                                items-center
                                gap-3
                            "
                        >

                            <div
                                className="
                                    rounded-xl
                                    bg-slate-50
                                    px-4
                                    py-2.5
                                    text-sm
                                    text-slate-600
                                "
                            >
                                📚 {topics.length}{" "}
                                {topics.length === 1 ? "Topic" : "Topics"}
                            </div>

                            <div
                                className="
                                    rounded-xl
                                    bg-slate-50
                                    px-4
                                    py-2.5
                                    text-sm
                                    text-slate-600
                                "
                            >
                                🎯 Learn at your pace
                            </div>

                        </div>

                    </div>

                </section>


                {/* =================================================
                    TOPICS
                ================================================= */}

                <section className="mt-10">

                    <div className="mb-6">

                        <h2
                            className="
                                text-2xl
                                font-bold
                                text-slate-900
                            "
                        >
                            Topics
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Choose a topic and start learning.
                        </p>

                    </div>


                    {/* =================================================
                        TOPICS LOADING
                    ================================================= */}

                    {topicsLoading && (
                        <div className="space-y-3">

                            {[1, 2, 3].map((item) => (
                                <div
                                    key={item}
                                    className="
                                        h-24
                                        animate-pulse
                                        rounded-2xl
                                        border
                                        border-slate-200
                                        bg-white
                                    "
                                />
                            ))}

                        </div>
                    )}


                    {/* =================================================
                        TOPICS ERROR
                    ================================================= */}

                    {!topicsLoading && topicsError && (
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

                            <p className="font-medium text-slate-700">
                                {topicsError}
                            </p>

                            <p className="mt-2 text-sm text-slate-500">
                                Make sure this module has published topics.
                            </p>

                        </div>
                    )}


                    {/* =================================================
                        NO TOPICS
                    ================================================= */}

                    {!topicsLoading &&
                        !topicsError &&
                        topics.length === 0 && (
                            <div
                                className="
                                    rounded-2xl
                                    border
                                    border-dashed
                                    border-slate-300
                                    bg-white
                                    p-10
                                    text-center
                                "
                            >

                                <div
                                    className="
                                        mx-auto
                                        flex
                                        h-14
                                        w-14
                                        items-center
                                        justify-center
                                        rounded-2xl
                                        bg-slate-100
                                        text-xl
                                    "
                                >
                                    📚
                                </div>

                                <h3 className="mt-4 font-semibold text-slate-800">
                                    No topics yet
                                </h3>

                                <p className="mt-1 text-sm text-slate-500">
                                    Topics for this module will appear here.
                                </p>

                            </div>
                        )}


                    {/* =================================================
                        TOPIC LIST
                    ================================================= */}

                    {!topicsLoading && topics.length > 0 && (
                        <div className="space-y-3">

                            {topics.map((topic, index) => (

                                <Link
                                    key={topic.id}
                                    to={`/topics/${topic.id}`}
                                    className="
                                        group
                                        flex
                                        items-center
                                        gap-4
                                        rounded-2xl
                                        border
                                        border-slate-200
                                        bg-white
                                        p-5
                                        shadow-sm
                                        transition
                                        hover:-translate-y-0.5
                                        hover:border-blue-200
                                        hover:shadow-md
                                    "
                                >

                                    {/* Number */}

                                    <div
                                        className="
                                            flex
                                            h-11
                                            w-11
                                            flex-shrink-0
                                            items-center
                                            justify-center
                                            rounded-xl
                                            bg-blue-50
                                            text-sm
                                            font-bold
                                            text-blue-600
                                            transition
                                            group-hover:bg-blue-600
                                            group-hover:text-white
                                        "
                                    >
                                        {index + 1}
                                    </div>


                                    {/* Topic information */}

                                    <div className="min-w-0 flex-1">

                                        <h3
                                            className="
                                                truncate
                                                text-base
                                                font-semibold
                                                text-slate-900
                                                transition
                                                group-hover:text-blue-600
                                            "
                                        >
                                            {topic.title}
                                        </h3>

                                        <p
                                            className="
                                                mt-1
                                                line-clamp-2
                                                text-sm
                                                leading-6
                                                text-slate-500
                                            "
                                        >
                                            {topic.description}
                                        </p>

                                    </div>


                                    {/* YouTube indicator */}

                                    <div
                                        className="
                                            hidden
                                            items-center
                                            gap-2
                                            text-xs
                                            font-medium
                                            text-slate-400
                                            sm:flex
                                        "
                                    >
                                        <span>Video</span>
                                    </div>


                                    {/* Arrow */}

                                    <div
                                        className="
                                            flex
                                            h-9
                                            w-9
                                            flex-shrink-0
                                            items-center
                                            justify-center
                                            rounded-full
                                            bg-slate-50
                                            text-slate-400
                                            transition
                                            group-hover:bg-blue-50
                                            group-hover:text-blue-600
                                        "
                                    >
                                        →
                                    </div>

                                </Link>

                            ))}

                        </div>
                    )}

                </section>

            </div>

        </main>
    );
};

export default Module;