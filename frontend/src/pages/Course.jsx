import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:8000";

const Course = () => {

    const { courseId } = useParams();

    const [course, setCourse] = useState(null);
    const [modules, setModules] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // =====================================================
    // FETCH COURSE + MODULES
    // =====================================================

    useEffect(() => {

        const fetchCourseData = async () => {

            try {

                setLoading(true);
                setError("");

                // -----------------------------------------
                // GET COURSE
                // -----------------------------------------

                const courseResponse = await axios.get(
                    `${API_URL}/courses/${courseId}`
                );

                setCourse(courseResponse.data);

                // -----------------------------------------
                // GET MODULES
                // -----------------------------------------

                const modulesResponse = await axios.get(
                    `${API_URL}/modules/course/${courseId}`
                );

                setModules(modulesResponse.data);

            } catch (err) {

                console.error("Course error:", err);

                if (err.response?.status === 404) {

                    setError("Course not found.");

                } else if (err.response?.status === 400) {

                    setError("Invalid course ID.");

                } else {

                    setError(
                        "Unable to load the course. Please try again."
                    );
                }

            } finally {

                setLoading(false);

            }
        };

        if (courseId) {
            fetchCourseData();
        }

    }, [courseId]);


    // =====================================================
    // LOADING
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
                        Loading course...
                    </p>

                </div>

            </div>
        );
    }


    // =====================================================
    // ERROR
    // =====================================================

    if (error) {

        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6">

                <div className="text-center">

                    <h1 className="text-2xl font-bold text-slate-900">
                        {error}
                    </h1>

                    <p className="mt-2 text-slate-500">
                        Something went wrong while loading this course.
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
    // COURSE PAGE
    // =====================================================

    return (

        <div className="min-h-screen bg-slate-50 text-slate-900">

            <main className="mx-auto max-w-5xl px-6 py-12">

                {/* =========================================
                    BACK
                ========================================= */}

                <Link
                    to="/courses"
                    className="
                        text-sm
                        font-medium
                        text-blue-600
                        transition
                        hover:text-blue-700
                    "
                >
                    ← Back to Courses
                </Link>


                {/* =========================================
                    COURSE HEADER
                ========================================= */}

                <section
                    className="
                        mt-6
                        rounded-3xl
                        border
                        border-slate-200
                        bg-white
                        p-8
                        shadow-sm
                        md:p-10
                    "
                >

                    <p
                        className="
                            text-sm
                            font-semibold
                            uppercase
                            tracking-wider
                            text-blue-600
                        "
                    >
                        Course
                    </p>


                    <h1
                        className="
                            mt-3
                            text-3xl
                            font-bold
                            text-slate-900
                            md:text-4xl
                        "
                    >
                        {course.title}
                    </h1>


                    <p
                        className="
                            mt-4
                            max-w-3xl
                            leading-7
                            text-slate-600
                        "
                    >
                        {course.description}
                    </p>


                    <div
                        className="
                            mt-6
                            flex
                            items-center
                            gap-6
                            text-sm
                            text-slate-500
                        "
                    >

                        <span>
                            📚 {modules.length} Modules
                        </span>

                    </div>

                </section>


                {/* =========================================
                    MODULES
                ========================================= */}

                <section className="mt-10">

                    <div className="mb-6">

                        <h2
                            className="
                                text-2xl
                                font-bold
                                text-slate-900
                            "
                        >
                            Course Modules
                        </h2>

                        <p className="mt-2 text-slate-500">
                            Select a module to start learning.
                        </p>

                    </div>


                    {/* =====================================
                        NO MODULES
                    ===================================== */}

                    {modules.length === 0 ? (

                        <div
                            className="
                                rounded-2xl
                                border
                                border-slate-200
                                bg-white
                                p-10
                                text-center
                            "
                        >

                            <p className="text-slate-500">
                                No modules available for this course yet.
                            </p>

                        </div>

                    ) : (

                        <div className="space-y-4">

                            {modules.map((module, index) => (

                                <Link
                                    key={module.id}
                                    to={`/modules/${module.id}`}
                                    className="
                                        group
                                        flex
                                        items-center
                                        gap-5
                                        rounded-2xl
                                        border
                                        border-slate-200
                                        bg-white
                                        p-6
                                        no-underline
                                        transition
                                        hover:-translate-y-0.5
                                        hover:border-blue-300
                                        hover:shadow-md
                                    "
                                >

                                    {/* NUMBER */}

                                    <div
                                        className="
                                            flex
                                            h-12
                                            w-12
                                            shrink-0
                                            items-center
                                            justify-center
                                            rounded-xl
                                            bg-blue-50
                                            font-bold
                                            text-blue-600
                                            transition
                                            group-hover:bg-blue-600
                                            group-hover:text-white
                                        "
                                    >
                                        {index + 1}
                                    </div>


                                    {/* CONTENT */}

                                    <div className="flex-1">

                                        <p
                                            className="
                                                text-xs
                                                font-semibold
                                                uppercase
                                                tracking-wide
                                                text-blue-600
                                            "
                                        >
                                            Module {module.order}
                                        </p>

                                        <h3
                                            className="
                                                mt-1
                                                text-lg
                                                font-semibold
                                                text-slate-900
                                            "
                                        >
                                            {module.title}
                                        </h3>

                                        <p
                                            className="
                                                mt-1
                                                text-sm
                                                leading-6
                                                text-slate-500
                                            "
                                        >
                                            {module.description}
                                        </p>

                                    </div>


                                    {/* ARROW */}

                                    <span
                                        className="
                                            text-xl
                                            text-slate-400
                                            transition
                                            group-hover:translate-x-1
                                            group-hover:text-blue-600
                                        "
                                    >
                                        →
                                    </span>

                                </Link>

                            ))}

                        </div>

                    )}

                </section>

            </main>

        </div>
    );
};

export default Course;