import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

const Course = () => {
    const { courseId } = useParams();

    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Temporary data
        // Later we will connect this with the FastAPI backend
        const demoCourse = {
            id: courseId,
            title: "Java Programming",
            description:
                "Learn Java programming from the basics to advanced concepts with practical examples and problem solving.",
            instructor: "Campus Scrolls",
            modules: 8,
            topics: 42,
            students: 1250,
            progress: 35,
        };

        setTimeout(() => {
            setCourse(demoCourse);
            setLoading(false);
        }, 500);
    }, [courseId]);

    if (loading) {
        return (
            <div style={styles.loadingContainer}>
                <div style={styles.loader}></div>
                <p>Loading course...</p>
            </div>
        );
    }

    return (
        <div style={styles.page}>

            {/* ================= NAVBAR ================= */}

            <nav style={styles.navbar}>
                <Link to="/" style={styles.logo}>
                    Campus<span>Scrolls</span>
                </Link>

                <div style={styles.navLinks}>
                    <Link to="/courses" style={styles.navLink}>
                        Courses
                    </Link>

                    <Link to="/dashboard" style={styles.navLink}>
                        Dashboard
                    </Link>

                    <Link to="/profile" style={styles.navLink}>
                        Profile
                    </Link>
                </div>
            </nav>

            {/* ================= HERO ================= */}

            <section style={styles.hero}>

                <div style={styles.heroContent}>

                    <div style={styles.badge}>
                        📚 Course
                    </div>

                    <h1 style={styles.title}>
                        {course.title}
                    </h1>

                    <p style={styles.description}>
                        {course.description}
                    </p>

                    <div style={styles.stats}>

                        <div style={styles.stat}>
                            <strong>{course.modules}</strong>
                            <span>Modules</span>
                        </div>

                        <div style={styles.stat}>
                            <strong>{course.topics}</strong>
                            <span>Topics</span>
                        </div>

                        <div style={styles.stat}>
                            <strong>{course.students}</strong>
                            <span>Students</span>
                        </div>

                    </div>

                    <div style={styles.buttons}>

                        <Link
                            to="/dashboard"
                            style={styles.primaryButton}
                        >
                            Continue Learning →
                        </Link>

                        <Link
                            to="/courses"
                            style={styles.secondaryButton}
                        >
                            ← Back to Courses
                        </Link>

                    </div>

                </div>

            </section>

            {/* ================= COURSE CONTENT ================= */}

            <section style={styles.content}>

                <div style={styles.contentHeader}>
                    <h2>Course Modules</h2>

                    <p>
                        Follow the modules step by step and build your
                        programming skills.
                    </p>
                </div>

                <div style={styles.moduleGrid}>

                    {[1, 2, 3, 4, 5, 6].map((module) => (

                        <Link
                            key={module}
                            to={`/modules/${module}`}
                            style={styles.moduleCard}
                        >

                            <div style={styles.moduleNumber}>
                                {module}
                            </div>

                            <div>
                                <h3>
                                    Module {module}
                                </h3>

                                <p>
                                    Learn important Java concepts
                                    and practice with examples.
                                </p>

                                <span style={styles.learnMore}>
                                    Start Learning →
                                </span>
                            </div>

                        </Link>

                    ))}

                </div>

            </section>

            {/* ================= FOOTER ================= */}

            <footer style={styles.footer}>
                <p>
                    © 2026 Campus Scrolls. Learn. Build. Grow.
                </p>
            </footer>

        </div>
    );
};

const styles = {

    page: {
        minHeight: "100vh",
        background: "#f8fafc",
        color: "#0f172a",
        fontFamily:
            "Inter, system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
    },

    navbar: {
        height: "70px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 7%",
        background: "#ffffff",
        borderBottom: "1px solid #e2e8f0",
        position: "sticky",
        top: 0,
        zIndex: 10,
    },

    logo: {
        fontSize: "24px",
        fontWeight: "800",
        textDecoration: "none",
        color: "#0f172a",
    },

    navLinks: {
        display: "flex",
        gap: "30px",
    },

    navLink: {
        textDecoration: "none",
        color: "#475569",
        fontWeight: "500",
        transition: "0.3s",
    },

    hero: {
        background:
            "linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #2563eb 100%)",
        color: "white",
        padding: "80px 7%",
    },

    heroContent: {
        maxWidth: "900px",
        margin: "auto",
    },

    badge: {
        display: "inline-block",
        padding: "8px 16px",
        borderRadius: "30px",
        background: "rgba(255,255,255,0.15)",
        marginBottom: "20px",
        fontSize: "14px",
    },

    title: {
        fontSize: "clamp(40px, 6vw, 70px)",
        margin: "0 0 20px",
        fontWeight: "800",
        lineHeight: "1.05",
    },

    description: {
        fontSize: "18px",
        lineHeight: "1.7",
        color: "#dbeafe",
        maxWidth: "700px",
    },

    stats: {
        display: "flex",
        gap: "50px",
        marginTop: "35px",
        flexWrap: "wrap",
    },

    stat: {
        display: "flex",
        flexDirection: "column",
        gap: "5px",
    },

    buttons: {
        display: "flex",
        gap: "15px",
        marginTop: "40px",
        flexWrap: "wrap",
    },

    primaryButton: {
        textDecoration: "none",
        background: "#ffffff",
        color: "#1d4ed8",
        padding: "14px 24px",
        borderRadius: "10px",
        fontWeight: "700",
        transition: "0.3s",
    },

    secondaryButton: {
        textDecoration: "none",
        border: "1px solid rgba(255,255,255,0.4)",
        color: "white",
        padding: "14px 24px",
        borderRadius: "10px",
        fontWeight: "600",
    },

    content: {
        maxWidth: "1100px",
        margin: "auto",
        padding: "70px 7%",
    },

    contentHeader: {
        marginBottom: "35px",
    },

    moduleGrid: {
        display: "grid",
        gridTemplateColumns:
            "repeat(auto-fit, minmax(280px, 1fr))",
        gap: "20px",
    },

    moduleCard: {
        display: "flex",
        gap: "20px",
        padding: "25px",
        background: "white",
        borderRadius: "16px",
        border: "1px solid #e2e8f0",
        textDecoration: "none",
        color: "#0f172a",
        transition: "0.3s",
        boxShadow: "0 5px 20px rgba(15,23,42,0.05)",
    },

    moduleNumber: {
        minWidth: "45px",
        height: "45px",
        borderRadius: "12px",
        background: "#dbeafe",
        color: "#1d4ed8",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: "800",
        fontSize: "18px",
    },

    learnMore: {
        color: "#2563eb",
        fontWeight: "600",
        fontSize: "14px",
    },

    footer: {
        textAlign: "center",
        padding: "30px",
        background: "#0f172a",
        color: "#94a3b8",
    },

    loadingContainer: {
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
    },

    loader: {
        width: "40px",
        height: "40px",
        border: "4px solid #e2e8f0",
        borderTop: "4px solid #2563eb",
        borderRadius: "50%",
        marginBottom: "15px",
    },
};

export default Course;