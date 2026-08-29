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
// ADMIN LOGIN
// =========================

import AdminLogin from "../pages/admin/AdminLogin";

// =========================
// ADMIN PAGES
// =========================

import AdminDashboard from "../pages/admin/AdminDashboard";
import ManageCourses from "../pages/admin/ManageCourses";
import ManageModules from "../pages/admin/ManageModules";
import ManageTopics from "../pages/admin/ManageTopics";
import ManageProblems from "../pages/admin/ManageProblems";
import AddProblem from "../pages/admin/AddProblem";
import ManageUsers from "../pages/admin/ManageUsers";
import ManageMaterials from "../pages/admin/ManageMaterials";
import AddMaterial from "../pages/AddMaterial";

// =========================
// PROTECTED ROUTE
// =========================

import ProtectedRoute from "./ProtectedRoute";


const AppRoutes = () => {
    return (
        <Routes>

            {/* =========================
                PUBLIC
            ========================= */}

            <Route
                path="/"
                element={<Home />}
            />

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
                STUDENT PROBLEM
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
                ADMIN LOGIN
            ========================= */}

            <Route
                path="/admin/login"
                element={<AdminLogin />}
            />


            {/* =========================
                ADMIN DASHBOARD
            ========================= */}

            <Route
                path="/admin"
                element={
                    <ProtectedRoute>
                        <AdminDashboard />
                    </ProtectedRoute>
                }
            />


            {/* =========================
                ADMIN COURSES
            ========================= */}

            <Route
                path="/admin/courses"
                element={
                    <ProtectedRoute>
                        <ManageCourses />
                    </ProtectedRoute>
                }
            />


            {/* =========================
                ADMIN MODULES
            ========================= */}

            <Route
                path="/admin/modules"
                element={
                    <ProtectedRoute>
                        <ManageModules />
                    </ProtectedRoute>
                }
            />


            {/* =========================
                ADMIN TOPICS
            ========================= */}

            <Route
                path="/admin/topics"
                element={
                    <ProtectedRoute>
                        <ManageTopics />
                    </ProtectedRoute>
                }
            />


            {/* =========================
                ADMIN PROBLEMS
            ========================= */}

            <Route
                path="/admin/problems"
                element={
                    <ProtectedRoute>
                        <ManageProblems />
                    </ProtectedRoute>
                }
            />

            {
/* =========================
    ADD PROBLEM
========================= */}

<Route
    path="/admin/problems/add"
    element={
        <ProtectedRoute>
            <AddProblem />
        </ProtectedRoute>
    }
/>


            {/* =========================
                ADMIN USERS
            ========================= */}

            <Route
                path="/admin/users"
                element={
                    <ProtectedRoute>
                        <ManageUsers />
                    </ProtectedRoute>
                }
            />


            {/* =========================
                ADMIN MATERIALS
            ========================= */}

            <Route
                path="/admin/materials"
                element={
                    <ProtectedRoute>
                        <ManageMaterials />
                    </ProtectedRoute>
                }
            />


            {/* =========================
                ADD MATERIAL
            ========================= */}

            <Route
                path="/admin/materials/add"
                element={
                    <ProtectedRoute>
                        <AddMaterial />
                    </ProtectedRoute>
                }
            />


            {/* =========================
                404
            ========================= */}

            <Route
                path="*"
                element={
                    <div className="min-h-[60vh] flex items-center justify-center bg-white px-6">
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