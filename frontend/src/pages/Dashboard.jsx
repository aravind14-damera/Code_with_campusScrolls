import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

const Dashboard = () => {
    const [loading, setLoading] = useState(true);

    const [dashboard, setDashboard] = useState({
        user: {
            name: "Student",
            email: "student@example.com",
        },
        statistics: {
            total_courses: 3,
            total_topics: 42,
            completed_topics: 18,
            overall_progress: 43,
        },
        courses: [
            {
                course_id: "1",
                title: "Java Programming",
                description: "Learn Java from basics to advanced concepts.",
                total_topics: 20,
                completed_topics: 12,
                progress_percentage: 60,
            },
            {
                course_id: "2",
                title: "Data Structures & Algorithms",
                description: "Master DSA and improve your problem solving.",
                total_topics: 15,
                completed_topics: 5,
                progress_percentage: 33,
            },
            {
                course_id: "3",
                title: "SQL & DBMS",
                description: "Learn SQL queries and database concepts.",
                total_topics: 7,
                completed_topics: 1,
                progress_percentage: 14,
            },
        ],
    });

    useEffect(() => {
        // Temporary demo data.
        // Later we will connect this to:
        // GET /dashboard

        setTimeout(() => {
            setLoading(false);
        }, 500);
    }, []);

    if (loading) {
        return (
            <div className="dashboard-loading">
                <div className="dashboard-loader"></div>
                <p>Loading your dashboard...</p>
            </div>
        );
    }

    const {
        user,
        statistics,
        courses,
    } = dashboard;

    return (
        <div className="dashboard-page">

            {/* ================= NAVBAR ================= */}

            <nav className="dashboard-navbar">

                <Link
                    to="/"
                    className="dashboard-logo"
                >
                    Campus<span>Scrolls</span>
                </Link>

                <div className="dashboard-nav-links">

                    <Link to="/courses">
                        Courses
                    </Link>

                    <Link to="/dashboard">
                        Dashboard
                    </Link>

                    <Link to="/profile">
                        Profile
                    </Link>

                </div>

            </nav>


            {/* ================= MAIN ================= */}

            <main className="dashboard-container">

                {/* Welcome */}

                <section className="dashboard-welcome">

                    <div>

                        <p className="dashboard-small-title">
                            STUDENT DASHBOARD
                        </p>

                        <h1>
                            Welcome back, {user.name} 👋
                        </h1>

                        <p>
                            Continue your learning journey and
                            keep improving your skills.
                        </p>

                    </div>

                    <Link
                        to="/courses"
                        className="dashboard-browse-button"
                    >
                        Explore Courses →
                    </Link>

                </section>


                {/* ================= STATISTICS ================= */}

                <section className="dashboard-stats">

                    <div className="dashboard-stat-card">

                        <div className="stat-icon blue">
                            📚
                        </div>

                        <div>
                            <span>
                                Enrolled Courses
                            </span>

                            <strong>
                                {statistics.total_courses}
                            </strong>
                        </div>

                    </div>


                    <div className="dashboard-stat-card">

                        <div className="stat-icon purple">
                            📖
                        </div>

                        <div>
                            <span>
                                Total Topics
                            </span>

                            <strong>
                                {statistics.total_topics}
                            </strong>
                        </div>

                    </div>


                    <div className="dashboard-stat-card">

                        <div className="stat-icon green">
                            ✅
                        </div>

                        <div>
                            <span>
                                Completed Topics
                            </span>

                            <strong>
                                {statistics.completed_topics}
                            </strong>
                        </div>

                    </div>


                    <div className="dashboard-stat-card">

                        <div className="stat-icon orange">
                            📈
                        </div>

                        <div>
                            <span>
                                Overall Progress
                            </span>

                            <strong>
                                {statistics.overall_progress}%
                            </strong>
                        </div>

                    </div>

                </section>


                {/* ================= OVERALL PROGRESS ================= */}

                <section className="overall-progress-card">

                    <div className="progress-header">

                        <div>
                            <h2>
                                Overall Learning Progress
                            </h2>

                            <p>
                                Your progress across all enrolled courses.
                            </p>
                        </div>

                        <strong>
                            {statistics.overall_progress}%
                        </strong>

                    </div>

                    <div className="progress-background">

                        <div
                            className="progress-fill"
                            style={{
                                width: `${statistics.overall_progress}%`,
                            }}
                        />

                    </div>

                </section>


                {/* ================= COURSES ================= */}

                <section className="dashboard-courses">

                    <div className="section-heading">

                        <div>
                            <p className="dashboard-small-title">
                                MY LEARNING
                            </p>

                            <h2>
                                Your Courses
                            </h2>
                        </div>

                        <Link to="/courses">
                            View all →
                        </Link>

                    </div>


                    <div className="dashboard-course-grid">

                        {courses.map((course) => (

                            <div
                                className="dashboard-course-card"
                                key={course.course_id}
                            >

                                <div className="course-card-top">

                                    <div className="course-icon">
                                        💻
                                    </div>

                                    <span className="course-percentage">
                                        {course.progress_percentage}%
                                    </span>

                                </div>


                                <h3>
                                    {course.title}
                                </h3>

                                <p>
                                    {course.description}
                                </p>


                                <div className="course-progress-info">

                                    <span>
                                        {course.completed_topics} of{" "}
                                        {course.total_topics} topics
                                    </span>

                                    <span>
                                        {course.progress_percentage}%
                                    </span>

                                </div>


                                <div className="course-progress-background">

                                    <div
                                        className="course-progress-fill"
                                        style={{
                                            width: `${course.progress_percentage}%`,
                                        }}
                                    />

                                </div>


                                <Link
                                    to={`/courses/${course.course_id}`}
                                    className="continue-button"
                                >
                                    Continue Learning →
                                </Link>

                            </div>

                        ))}

                    </div>

                </section>


                {/* ================= QUICK ACTIONS ================= */}

                <section className="quick-actions">

                    <h2>
                        Quick Actions
                    </h2>

                    <div className="quick-action-grid">

                        <Link
                            to="/courses"
                            className="quick-action-card"
                        >
                            <span>📚</span>

                            <div>
                                <h3>
                                    Browse Courses
                                </h3>

                                <p>
                                    Find something new to learn.
                                </p>
                            </div>

                            <b>→</b>
                        </Link>


                        <Link
                            to="/profile"
                            className="quick-action-card"
                        >
                            <span>👤</span>

                            <div>
                                <h3>
                                    Your Profile
                                </h3>

                                <p>
                                    Manage your account.
                                </p>
                            </div>

                            <b>→</b>
                        </Link>

                    </div>

                </section>

            </main>


            {/* ================= FOOTER ================= */}

            <footer className="dashboard-footer">

                <p>
                    © 2026 Campus Scrolls. Learn • Practice • Grow
                </p>

            </footer>


            {/* ================= PAGE CSS ================= */}

            <style>{`

                * {
                    box-sizing: border-box;
                }

                .dashboard-page {
                    min-height: 100vh;
                    background: #f8fafc;
                    color: #0f172a;
                    font-family:
                        Inter,
                        system-ui,
                        -apple-system,
                        BlinkMacSystemFont,
                        "Segoe UI",
                        sans-serif;
                }

                /* NAVBAR */

                .dashboard-navbar {
                    height: 70px;
                    background: white;
                    border-bottom: 1px solid #e2e8f0;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 0 7%;
                    position: sticky;
                    top: 0;
                    z-index: 100;
                }

                .dashboard-logo {
                    font-size: 24px;
                    font-weight: 800;
                    text-decoration: none;
                    color: #0f172a;
                }

                .dashboard-logo span {
                    color: #2563eb;
                }

                .dashboard-nav-links {
                    display: flex;
                    gap: 28px;
                }

                .dashboard-nav-links a {
                    text-decoration: none;
                    color: #64748b;
                    font-weight: 500;
                    transition: 0.25s;
                }

                .dashboard-nav-links a:hover {
                    color: #2563eb;
                }

                /* CONTAINER */

                .dashboard-container {
                    max-width: 1200px;
                    margin: auto;
                    padding: 50px 6%;
                }

                /* WELCOME */

                .dashboard-welcome {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 30px;
                    margin-bottom: 40px;
                }

                .dashboard-small-title {
                    font-size: 12px;
                    letter-spacing: 2px;
                    font-weight: 700;
                    color: #2563eb;
                    margin-bottom: 10px;
                }

                .dashboard-welcome h1 {
                    font-size: 38px;
                    margin: 0 0 10px;
                }

                .dashboard-welcome p {
                    color: #64748b;
                    margin: 0;
                }

                .dashboard-browse-button {
                    background: #2563eb;
                    color: white;
                    padding: 13px 20px;
                    border-radius: 10px;
                    text-decoration: none;
                    font-weight: 600;
                    transition: 0.3s;
                    white-space: nowrap;
                }

                .dashboard-browse-button:hover {
                    background: #1d4ed8;
                    transform: translateY(-2px);
                    box-shadow: 0 10px 25px rgba(37,99,235,0.2);
                }

                /* STATS */

                .dashboard-stats {
                    display: grid;
                    grid-template-columns:
                        repeat(4, 1fr);
                    gap: 18px;
                    margin-bottom: 25px;
                }

                .dashboard-stat-card {
                    background: white;
                    border: 1px solid #e2e8f0;
                    border-radius: 16px;
                    padding: 22px;
                    display: flex;
                    align-items: center;
                    gap: 16px;
                    transition: 0.3s;
                }

                .dashboard-stat-card:hover {
                    transform: translateY(-5px);
                    box-shadow:
                        0 15px 35px
                        rgba(15,23,42,0.08);
                }

                .dashboard-stat-card span {
                    display: block;
                    color: #64748b;
                    font-size: 13px;
                    margin-bottom: 5px;
                }

                .dashboard-stat-card strong {
                    font-size: 25px;
                }

                .stat-icon {
                    width: 48px;
                    height: 48px;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 21px;
                }

                .stat-icon.blue {
                    background: #dbeafe;
                }

                .stat-icon.purple {
                    background: #ede9fe;
                }

                .stat-icon.green {
                    background: #dcfce7;
                }

                .stat-icon.orange {
                    background: #ffedd5;
                }

                /* OVERALL */

                .overall-progress-card {
                    background: white;
                    border: 1px solid #e2e8f0;
                    border-radius: 18px;
                    padding: 28px;
                    margin-bottom: 50px;
                }

                .progress-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-bottom: 20px;
                }

                .progress-header h2 {
                    margin: 0 0 5px;
                    font-size: 20px;
                }

                .progress-header p {
                    color: #64748b;
                    margin: 0;
                    font-size: 14px;
                }

                .progress-header strong {
                    font-size: 28px;
                    color: #2563eb;
                }

                .progress-background,
                .course-progress-background {
                    height: 9px;
                    background: #e2e8f0;
                    border-radius: 20px;
                    overflow: hidden;
                }

                .progress-fill,
                .course-progress-fill {
                    height: 100%;
                    background: #2563eb;
                    border-radius: inherit;
                    transition: width 0.8s ease;
                }

                /* COURSES */

                .section-heading {
                    display: flex;
                    align-items: end;
                    justify-content: space-between;
                    margin-bottom: 25px;
                }

                .section-heading h2 {
                    margin: 0;
                    font-size: 28px;
                }

                .section-heading a {
                    color: #2563eb;
                    text-decoration: none;
                    font-weight: 600;
                }

                .dashboard-course-grid {
                    display: grid;
                    grid-template-columns:
                        repeat(3, 1fr);
                    gap: 22px;
                }

                .dashboard-course-card {
                    background: white;
                    border: 1px solid #e2e8f0;
                    border-radius: 18px;
                    padding: 25px;
                    transition: 0.3s;
                }

                .dashboard-course-card:hover {
                    transform: translateY(-6px);
                    box-shadow:
                        0 20px 40px
                        rgba(15,23,42,0.09);
                    border-color: #bfdbfe;
                }

                .course-card-top {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .course-icon {
                    width: 50px;
                    height: 50px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 13px;
                    background: #dbeafe;
                    font-size: 22px;
                }

                .course-percentage {
                    color: #2563eb;
                    font-weight: 700;
                }

                .dashboard-course-card h3 {
                    margin: 22px 0 8px;
                    font-size: 20px;
                }

                .dashboard-course-card > p {
                    color: #64748b;
                    line-height: 1.6;
                    min-height: 50px;
                }

                .course-progress-info {
                    display: flex;
                    justify-content: space-between;
                    color: #64748b;
                    font-size: 13px;
                    margin: 20px 0 8px;
                }

                .continue-button {
                    display: block;
                    margin-top: 22px;
                    padding: 12px;
                    text-align: center;
                    border-radius: 9px;
                    background: #eff6ff;
                    color: #2563eb;
                    text-decoration: none;
                    font-weight: 600;
                    transition: 0.3s;
                }

                .continue-button:hover {
                    background: #2563eb;
                    color: white;
                }

                /* QUICK ACTIONS */

                .quick-actions {
                    margin-top: 55px;
                }

                .quick-actions h2 {
                    font-size: 24px;
                    margin-bottom: 20px;
                }

                .quick-action-grid {
                    display: grid;
                    grid-template-columns:
                        repeat(2, 1fr);
                    gap: 20px;
                }

                .quick-action-card {
                    display: flex;
                    align-items: center;
                    gap: 18px;
                    background: white;
                    border: 1px solid #e2e8f0;
                    border-radius: 15px;
                    padding: 20px;
                    text-decoration: none;
                    color: #0f172a;
                    transition: 0.3s;
                }

                .quick-action-card:hover {
                    transform: translateY(-4px);
                    border-color: #93c5fd;
                }

                .quick-action-card > span {
                    font-size: 28px;
                }

                .quick-action-card h3 {
                    margin: 0 0 4px;
                }

                .quick-action-card p {
                    margin: 0;
                    color: #64748b;
                    font-size: 14px;
                }

                .quick-action-card b {
                    margin-left: auto;
                    color: #2563eb;
                    font-size: 20px;
                }

                /* FOOTER */

                .dashboard-footer {
                    margin-top: 40px;
                    padding: 30px;
                    text-align: center;
                    background: #0f172a;
                    color: #94a3b8;
                }

                /* LOADING */

                .dashboard-loading {
                    min-height: 100vh;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    color: #64748b;
                }

                .dashboard-loader {
                    width: 40px;
                    height: 40px;
                    border: 4px solid #e2e8f0;
                    border-top-color: #2563eb;
                    border-radius: 50%;
                    animation: spin 0.8s linear infinite;
                    margin-bottom: 15px;
                }

                @keyframes spin {
                    to {
                        transform: rotate(360deg);
                    }
                }

                /* RESPONSIVE */

                @media (max-width: 900px) {

                    .dashboard-stats {
                        grid-template-columns:
                            repeat(2, 1fr);
                    }

                    .dashboard-course-grid {
                        grid-template-columns:
                            repeat(2, 1fr);
                    }

                }

                @media (max-width: 650px) {

                    .dashboard-navbar {
                        padding: 0 20px;
                    }

                    .dashboard-nav-links {
                        display: none;
                    }

                    .dashboard-container {
                        padding: 35px 20px;
                    }

                    .dashboard-welcome {
                        flex-direction: column;
                        align-items: flex-start;
                    }

                    .dashboard-welcome h1 {
                        font-size: 30px;
                    }

                    .dashboard-stats {
                        grid-template-columns: 1fr;
                    }

                    .dashboard-course-grid {
                        grid-template-columns: 1fr;
                    }

                    .quick-action-grid {
                        grid-template-columns: 1fr;
                    }

                }

            `}</style>

        </div>
    );
};

export default Dashboard;