import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const API_URL = "http://localhost:8000";

const getCourseIcon = (title) => {
    const courseTitle = title.toLowerCase();

    if (courseTitle.includes("java")) {
        return "☕";
    }

    if (
        courseTitle.includes("data structure") ||
        courseTitle.includes("algorithm") ||
        courseTitle.includes("dsa")
    ) {
        return "🧠";
    }

    if (
        courseTitle.includes("sql") ||
        courseTitle.includes("dbms") ||
        courseTitle.includes("database")
    ) {
        return "🗄️";
    }

    return "📚";
};


const Courses = () => {

    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    // =====================================================
    // FETCH COURSES
    // =====================================================

    useEffect(() => {

        const fetchCourses = async () => {

            try {

                setLoading(true);
                setError("");

                const response = await axios.get(
                    `${API_URL}/courses`
                );

                setCourses(response.data);

            } catch (error) {

                console.error(
                    "Error fetching courses:",
                    error
                );

                setError(
                    "Unable to load courses. Please try again."
                );

            } finally {

                setLoading(false);

            }
        };


        fetchCourses();

    }, []);


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (
            <div className="min-h-screen bg-slate-50">

                <main className="mx-auto max-w-7xl px-6 py-20">

                    <div className="mb-12">

                        <div className="h-4 w-32 animate-pulse rounded bg-slate-200" />

                        <div className="mt-4 h-10 w-72 animate-pulse rounded bg-slate-200" />

                        <div className="mt-4 h-5 w-full max-w-2xl animate-pulse rounded bg-slate-200" />

                    </div>


                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

                        {[1, 2, 3].map((item) => (

                            <div
                                key={item}
                                className="h-80 animate-pulse rounded-3xl border border-slate-200 bg-white"
                            />

                        ))}

                    </div>

                </main>

            </div>
        );
    }


    // =====================================================
    // ERROR
    // =====================================================

    if (error) {

        return (
            <div className="min-h-screen bg-slate-50">

                <main className="mx-auto flex max-w-7xl justify-center px-6 py-20">

                    <div className="w-full max-w-lg rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm">

                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-2xl">
                            ⚠️
                        </div>

                        <h2 className="mt-5 text-xl font-bold text-slate-900">
                            Something went wrong
                        </h2>

                        <p className="mt-2 text-slate-500">
                            {error}
                        </p>

                        <button
                            onClick={() => window.location.reload()}
                            className="mt-6 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
                        >
                            Try Again
                        </button>

                    </div>

                </main>

            </div>
        );
    }


    // =====================================================
    // COURSES PAGE
    // =====================================================

    return (
        <div className="min-h-screen bg-slate-50">

            <main className="mx-auto max-w-7xl px-6 py-14">


                {/* ================================================= */}
                {/* HEADER */}
                {/* ================================================= */}

                <section className="mb-12">

                    <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600">
                        Learning Library
                    </p>

                    <div className="mt-3 flex flex-col justify-between gap-5 md:flex-row md:items-end">

                        <div>

                            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 md:text-5xl">
                                Explore Courses
                            </h1>

                            <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-500">
                                Choose a course and start building your programming skills through structured learning.
                            </p>

                        </div>


                        <div className="rounded-2xl border border-blue-100 bg-blue-50 px-5 py-3">

                            <p className="text-sm font-medium text-blue-600">
                                Available Courses
                            </p>

                            <p className="mt-1 text-2xl font-bold text-slate-900">
                                {courses.length}
                            </p>

                        </div>

                    </div>

                </section>


                {/* ================================================= */}
                {/* EMPTY STATE */}
                {/* ================================================= */}

                {courses.length === 0 && (

                    <div className="rounded-3xl border border-slate-200 bg-white px-6 py-20 text-center shadow-sm">

                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-3xl">
                            📚
                        </div>

                        <h2 className="mt-6 text-2xl font-bold text-slate-900">
                            No courses available
                        </h2>

                        <p className="mx-auto mt-3 max-w-md text-slate-500">
                            There are currently no published courses available.
                        </p>

                    </div>

                )}


                {/* ================================================= */}
                {/* COURSE CARDS */}
                {/* ================================================= */}

                {courses.length > 0 && (

                    <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">

                        {courses.map((course) => (

                            <Link
                                key={course.id}
                                to={`/courses/${course.id}`}
                                className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-2 hover:border-blue-200 hover:shadow-xl"
                            >

                                {/* Top blue decoration */}

                                <div className="absolute left-0 top-0 h-1 w-full bg-blue-600" />


                                {/* Icon + Arrow */}

                                <div className="flex items-center justify-between">

                                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-3xl transition duration-300 group-hover:scale-110">
                                        {getCourseIcon(course.title)}
                                    </div>

                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-50 text-slate-400 transition group-hover:bg-blue-600 group-hover:text-white">
                                        →
                                    </div>

                                </div>


                                {/* Course title */}

                                <h2 className="mt-7 text-2xl font-bold text-slate-900 transition group-hover:text-blue-600">
                                    {course.title}
                                </h2>


                                {/* Course description */}

                                <p className="mt-3 min-h-[72px] leading-7 text-slate-500">
                                    {course.description}
                                </p>


                                {/* Bottom */}

                                <div className="mt-7 flex items-center justify-between border-t border-slate-100 pt-5">

                                    <span className="text-sm font-medium text-slate-400">
                                        Published Course
                                    </span>

                                    <span className="font-semibold text-blue-600">
                                        Start Learning →
                                    </span>

                                </div>

                            </Link>

                        ))}

                    </div>

                )}

            </main>

        </div>
    );
};

export default Courses;