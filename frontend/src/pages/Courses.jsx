import { Link } from "react-router-dom";

const Courses = () => {

    const courses = [
        {
            id: 1,
            title: "Java Programming",
            description: "Learn Java from fundamentals to object-oriented programming.",
            icon: "☕",
            lessons: "25+ Topics",
        },
        {
            id: 2,
            title: "Data Structures & Algorithms",
            description: "Master problem solving and important DSA patterns.",
            icon: "🧠",
            lessons: "40+ Topics",
        },
        {
            id: 3,
            title: "SQL & DBMS",
            description: "Learn databases, SQL queries and DBMS fundamentals.",
            icon: "🗄️",
            lessons: "30+ Topics",
        },
    ];

    return (
        <div className="min-h-screen bg-slate-950 text-white">

            <nav className="border-b border-white/10">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

                    <Link
                        to="/"
                        className="text-2xl font-bold"
                    >
                        Campus<span className="text-blue-500">Scrolls</span>
                    </Link>

                    <Link
                        to="/dashboard"
                        className="rounded-xl border border-white/10 px-4 py-2 text-sm transition hover:bg-white/5"
                    >
                        Dashboard
                    </Link>

                </div>
            </nav>

            <main className="mx-auto max-w-7xl px-6 py-16">

                <div className="mb-12">
                    <p className="text-sm font-semibold uppercase tracking-widest text-blue-400">
                        Learning Library
                    </p>

                    <h1 className="mt-3 text-4xl font-bold md:text-5xl">
                        Explore Courses
                    </h1>

                    <p className="mt-4 max-w-2xl text-slate-400">
                        Choose a course and start building your programming skills.
                    </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

                    {courses.map((course) => (
                        <Link
                            key={course.id}
                            to={`/courses/${course.id}`}
                            className="group rounded-3xl border border-white/10 bg-white/[0.03] p-7 transition duration-300 hover:-translate-y-2 hover:border-blue-500/40 hover:bg-blue-500/[0.04] hover:shadow-2xl hover:shadow-blue-900/10"
                        >

                            <div className="mb-6 flex items-center justify-between">

                                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10 text-3xl transition group-hover:scale-110">
                                    {course.icon}
                                </div>

                                <span className="text-sm text-slate-500">
                                    {course.lessons}
                                </span>

                            </div>

                            <h2 className="text-2xl font-bold">
                                {course.title}
                            </h2>

                            <p className="mt-3 leading-7 text-slate-400">
                                {course.description}
                            </p>

                            <div className="mt-7 font-semibold text-blue-400 transition group-hover:translate-x-1">
                                Start Learning →
                            </div>

                        </Link>
                    ))}

                </div>

            </main>

        </div>
    );
};

export default Courses;