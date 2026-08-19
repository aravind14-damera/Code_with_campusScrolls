import { useNavigate } from "react-router-dom";

const Home = () => {
    const navigate = useNavigate();

    return (
        <main className="min-h-screen bg-white text-slate-900">

            {/* =========================
                HERO SECTION
            ========================= */}

            <section className="relative overflow-hidden">

                <div className="absolute inset-0 bg-gradient-to-b from-blue-50 via-white to-white" />

                <div className="relative max-w-7xl mx-auto px-6">

                    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center">

                        <div className="text-center max-w-4xl">

                            {/* Badge */}
                            <div className="
                                inline-flex
                                items-center
                                gap-2
                                px-5
                                py-2
                                rounded-full
                                border
                                border-blue-100
                                bg-blue-50
                                text-blue-600
                                text-sm
                                font-semibold
                                mb-8
                            ">
                                🚀
                                <span>Learn. Practice. Grow.</span>
                            </div>

                            {/* Heading */}
                            <h1 className="
                                text-5xl
                                md:text-7xl
                                font-extrabold
                                tracking-tight
                                leading-tight
                            ">
                                Learn Programming

                                <span className="
                                    block
                                    text-blue-600
                                ">
                                    The Smarter Way
                                </span>
                            </h1>

                            {/* Description */}
                            <p className="
                                mt-7
                                text-lg
                                md:text-xl
                                text-slate-500
                                max-w-2xl
                                mx-auto
                                leading-8
                            ">
                                Build strong programming fundamentals through
                                structured learning, practical coding problems,
                                and progress tracking.
                            </p>

                            {/* Login Button */}
                            <button
                                onClick={() => navigate("/login")}
                                className="
                                    mt-10
                                    px-8
                                    py-4
                                    rounded-xl
                                    bg-blue-600
                                    text-white
                                    font-semibold
                                    shadow-lg
                                    shadow-blue-200
                                    transition-all
                                    duration-300
                                    hover:bg-blue-700
                                    hover:-translate-y-1
                                    hover:shadow-xl
                                "
                            >
                                Login to Start →
                            </button>

                        </div>

                    </div>

                </div>

            </section>


            {/* =========================
                FEATURES
            ========================= */}

            <section className="
                border-t
                border-slate-100
                bg-slate-50
                py-24
            ">

                <div className="max-w-6xl mx-auto px-6">

                    <div className="text-center mb-14">

                        <p className="
                            text-blue-600
                            font-semibold
                            tracking-wider
                            uppercase
                            text-sm
                        ">
                            Why CodeWithCampusScrolls?
                        </p>

                        <h2 className="
                            mt-3
                            text-3xl
                            md:text-4xl
                            font-bold
                        ">
                            Everything you need to learn
                        </h2>

                        <p className="
                            mt-4
                            text-slate-500
                        ">
                            Learn concepts, practice problems and track your
                            progress in one place.
                        </p>

                    </div>


                    <div className="
                        grid
                        md:grid-cols-3
                        gap-6
                    ">

                        {[
                            {
                                icon: "📚",
                                title: "Structured Learning",
                                text: "Learn programming concepts through courses, modules and topics."
                            },
                            {
                                icon: "💻",
                                title: "Coding Practice",
                                text: "Practice problems and strengthen your problem-solving skills."
                            },
                            {
                                icon: "📈",
                                title: "Track Progress",
                                text: "Monitor your learning journey and see your improvement."
                            }
                        ].map((item) => (

                            <div
                                key={item.title}
                                className="
                                    group
                                    bg-white
                                    border
                                    border-slate-200
                                    rounded-2xl
                                    p-7
                                    transition-all
                                    duration-300
                                    hover:-translate-y-2
                                    hover:border-blue-200
                                    hover:shadow-xl
                                    hover:shadow-blue-100/50
                                "
                            >

                                <div className="
                                    w-14
                                    h-14
                                    flex
                                    items-center
                                    justify-center
                                    rounded-xl
                                    bg-blue-50
                                    text-2xl
                                    transition-transform
                                    duration-300
                                    group-hover:scale-110
                                ">
                                    {item.icon}
                                </div>

                                <h3 className="
                                    mt-6
                                    text-xl
                                    font-bold
                                ">
                                    {item.title}
                                </h3>

                                <p className="
                                    mt-3
                                    text-slate-500
                                    leading-7
                                ">
                                    {item.text}
                                </p>

                            </div>

                        ))}

                    </div>

                </div>

            </section>


            {/* =========================
                FOOTER
            ========================= */}

            <footer className="
                border-t
                border-slate-200
                bg-white
                py-6
            ">

                <div className="
                    max-w-7xl
                    mx-auto
                    px-6
                    text-center
                ">

                    <p className="
                        text-sm
                        text-slate-500
                    ">
                        © 2026{" "}
                        <span className="
                            font-semibold
                            text-slate-700
                        ">
                            CodeWithCampusScrolls
                        </span>
                        . All rights reserved.
                    </p>

                </div>

            </footer>

        </main>
    );
};

export default Home;