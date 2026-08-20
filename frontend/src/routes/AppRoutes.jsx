import { Routes, Route } from "react-router-dom";

// =========================
// PUBLIC / STUDENT PAGES
// =========================

import Home from "../pages/Home";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Courses from "../pages/Courses";
import Course from "../pages/Course";
import Module from "../pages/Module";
import Topic from "../pages/Topic";
import Problem from "../pages/Problem";
import Profile from "../pages/Profile";

// =========================
// ADMIN PAGES
// =========================

import AdminDashboard from "../pages/admin/AdminDashboard";
import ManageCourses from "../pages/admin/ManageCourses";
import ManageModules from "../pages/admin/ManageModules";
import ManageTopics from "../pages/admin/ManageTopics";
import ManageProblems from "../pages/admin/ManageProblems";
import ManageUsers from "../pages/admin/ManageUsers";

// =========================
// PROTECTED ROUTE
// =========================

import ProtectedRoute from "./ProtectedRoute";

const AppRoutes = () => {
    return (
        <Routes>

            {/* =========================
                HOME
            ========================= */}

            <Route
                path="/"
                element={<Home />}
            />

            {/* =========================
                AUTH
            ========================= */}

            <Route
                path="/login"
                element={<Login />}
            />

            <Route
                path="/signup"
                element={<Signup />}
            />

            {/* =========================
                COURSES
            ========================= */}

            <Route
                path="/courses"
                element={<Courses />}
            />

            <Route
                path="/courses/:courseId"
                element={<Course />}
            />

            {/* =========================
                MODULES
            ========================= */}

            <Route
                path="/modules/:moduleId"
                element={<Module />}
            />

            {/* =========================
                TOPICS
            ========================= */}

            <Route
                path="/topics/:topicId"
                element={<Topic />}
            />

            {/* =========================
                PROBLEMS
            ========================= */}

            <Route
                path="/problems/:problemId"
                element={<Problem />}
            />

            {/* =========================
                PROFILE
            ========================= */}

            <Route
                path="/profile"
                element={
                    <ProtectedRoute>
                        <Profile />
                    </ProtectedRoute>
                }
            />

            {/* =========================
                ADMIN
            ========================= */}

            <Route
                path="/admin"
                element={
                    <ProtectedRoute>
                        <AdminDashboard />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/admin/courses"
                element={
                    <ProtectedRoute>
                        <ManageCourses />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/admin/modules"
                element={
                    <ProtectedRoute>
                        <ManageModules />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/admin/topics"
                element={
                    <ProtectedRoute>
                        <ManageTopics />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/admin/problems"
                element={
                    <ProtectedRoute>
                        <ManageProblems />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/admin/users"
                element={
                    <ProtectedRoute>
                        <ManageUsers />
                    </ProtectedRoute>
                }
            />

            {/* =========================
                404
            ========================= */}

            <Route
                path="*"
                element={
                    <div className="flex min-h-[60vh] items-center justify-center px-6">
                        <div className="text-center">
                            <h1 className="text-4xl font-bold text-slate-900">
                                404
                            </h1>

                            <p className="mt-2 text-slate-500">
                                Page not found.
                            </p>
                        </div>
                    </div>
                }
            />

        </Routes>
    );
};

export default AppRoutes;