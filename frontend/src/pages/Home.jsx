import { useNavigate } from "react-router-dom";

const Home = () => {

    const navigate = useNavigate();

    return (

        <main className="
            min-h-screen
            w-full
            max-w-full
            overflow-x-hidden
            bg-white
            text-slate-900
        ">

            {/* =================================================
                HERO SECTION
            ================================================= */}

            <section className="
                relative
                w-full
                overflow-hidden
            ">

                {/* Background */}

                <div className="
                    absolute
                    inset-0
                    bg-gradient-to-b
                    from-blue-50
                    via-white
                    to-white
                " />


                {/* Content */}

                <div className="
                    relative
                    w-full
                    max-w-7xl
                    mx-auto
                    px-4
                    sm:px-6
                    lg:px-8
                ">

                    <div className="
                        min-h-[calc(100vh-80px)]
                        flex
                        items-center
                        justify-center
                        py-12
                        sm:py-16
                        lg:py-20
                    ">

                        <div className="
                            w-full
                            max-w-4xl
                            text-center
                        ">

                            {/* =================================================
                                BADGE
                            ================================================= */}

                            <div className="
                                inline-flex
                                max-w-full
                                items-center
                                justify-center
                                gap-2
                                px-4
                                sm:px-5
                                py-2
                                rounded-full
                                border
                                border-blue-100
                                bg-blue-50
                                text-blue-600
                                text-xs
                                sm:text-sm
                                font-semibold
                                mb-6
                                sm:mb-8
                            ">

                                <span>
                                    🚀
                                </span>

                                <span>
                                    Learn. Practice. Grow.
                                </span>

                            </div>


                            {/* =================================================
                                HEADING
                            ================================================= */}

                            <h1 className="
                                text-4xl
                                sm:text-5xl
                                md:text-6xl
                                lg:text-7xl
                                font-extrabold
                                tracking-tight
                                leading-[1.1]
                            ">

                                <span className="block">
                                    Learn
                                </span>

                                <span className="block">
                                    Programming
                                </span>

                                <span className="
                                    block
                                    text-blue-600
                                ">
                                    The Smarter Way
                                </span>

                            </h1>


                            {/* =================================================
                                DESCRIPTION
                            ================================================= */}

                            <p className="
                                mt-6
                                sm:mt-7
                                mx-auto
                                max-w-xl
                                sm:max-w-2xl
                                text-base
                                sm:text-lg
                                md:text-xl
                                text-slate-500
                                leading-7
                                sm:leading-8
                                px-2
                            ">

                                Build strong programming fundamentals through
                                structured learning, practical coding problems,
                                and progress tracking.

                            </p>


                            {/* =================================================
                                LOGIN BUTTON
                            ================================================= */}

                            <button
                                onClick={() => navigate("/login")}
                                className="
                                    mt-8
                                    sm:mt-10
                                    inline-flex
                                    items-center
                                    justify-center
                                    w-full
                                    max-w-[220px]
                                    sm:w-auto
                                    px-7
                                    sm:px-8
                                    py-3.5
                                    sm:py-4
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


            {/* =================================================
                FEATURES
            ================================================= */}

            <section className="
                w-full
                border-t
                border-slate-100
                bg-slate-50
                py-16
                sm:py-20
                lg:py-24
            ">

                <div className="
                    w-full
                    max-w-6xl
                    mx-auto
                    px-4
                    sm:px-6
                    lg:px-8
                ">


                    {/* =================================================
                        FEATURE HEADER
                    ================================================= */}

                    <div className="
                        text-center
                        mb-10
                        sm:mb-14
                    ">

                        <p className="
                            text-blue-600
                            font-semibold
                            tracking-wider
                            uppercase
                            text-xs
                            sm:text-sm
                        ">

                            Why CodeWithCampusScrolls?

                        </p>


                        <h2 className="
                            mt-3
                            text-2xl
                            sm:text-3xl
                            md:text-4xl
                            font-bold
                        ">

                            Everything you need to learn

                        </h2>


                        <p className="
                            mt-4
                            mx-auto
                            max-w-2xl
                            text-sm
                            sm:text-base
                            text-slate-500
                            leading-6
                            sm:leading-7
                        ">

                            Learn concepts, practice problems and track your
                            progress in one place.

                        </p>

                    </div>


                    {/* =================================================
                        FEATURE CARDS
                    ================================================= */}

                    <div className="
                        grid
                        grid-cols-1
                        md:grid-cols-3
                        gap-5
                        sm:gap-6
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
                                    w-full
                                    bg-white
                                    border
                                    border-slate-200
                                    rounded-2xl
                                    p-5
                                    sm:p-7
                                    transition-all
                                    duration-300
                                    hover:-translate-y-2
                                    hover:border-blue-200
                                    hover:shadow-xl
                                    hover:shadow-blue-100/50
                                "
                            >

                                {/* Icon */}

                                <div className="
                                    w-12
                                    h-12
                                    sm:w-14
                                    sm:h-14
                                    flex
                                    items-center
                                    justify-center
                                    rounded-xl
                                    bg-blue-50
                                    text-xl
                                    sm:text-2xl
                                    transition-transform
                                    duration-300
                                    group-hover:scale-110
                                ">

                                    {item.icon}

                                </div>


                                {/* Title */}

                                <h3 className="
                                    mt-5
                                    sm:mt-6
                                    text-lg
                                    sm:text-xl
                                    font-bold
                                ">

                                    {item.title}

                                </h3>


                                {/* Description */}

                                <p className="
                                    mt-3
                                    text-sm
                                    sm:text-base
                                    text-slate-500
                                    leading-6
                                    sm:leading-7
                                ">

                                    {item.text}

                                </p>

                            </div>

                        ))}

                    </div>

                </div>

            </section>

        </main>
    );
};


export default Home;