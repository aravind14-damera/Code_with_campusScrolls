import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL;

const ManageCourses = () => {
    const { token } = useContext(AuthContext);

    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const [showModal, setShowModal] = useState(false);
    const [editingCourse, setEditingCourse] = useState(null);

    const [form, setForm] = useState({
        title: "",
        description: "",
        is_published: false
    });

    // =====================================================
    // AXIOS CONFIG
    // =====================================================

    const getConfig = () => {
        return {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };
    };

    // =====================================================
    // GET COURSES
    // =====================================================

    const fetchCourses = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await axios.get(
                `${API_URL}/admin/courses`,
                getConfig()
            );

            setCourses(response.data);

        } catch (err) {
            console.error("Failed to load courses:", err);

            setError(
                err.response?.data?.detail ||
                "Failed to load courses."
            );

        } finally {
            setLoading(false);
        }
    };

    // =====================================================
    // INITIAL LOAD
    // =====================================================

    useEffect(() => {
        if (token) {
            fetchCourses();
        }
    }, [token]);

    // =====================================================
    // FORM CHANGE
    // =====================================================

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setForm((previous) => ({
            ...previous,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    // =====================================================
    // OPEN ADD MODAL
    // =====================================================

    const openAddModal = () => {
        setEditingCourse(null);

        setForm({
            title: "",
            description: "",
            is_published: false
        });

        setError("");
        setShowModal(true);
    };

    // =====================================================
    // OPEN EDIT MODAL
    // =====================================================

    const openEditModal = (course) => {
        setEditingCourse(course);

        setForm({
            title: course.title || "",
            description: course.description || "",
            is_published: course.is_published === true
        });

        setError("");
        setShowModal(true);
    };

    // =====================================================
    // CLOSE MODAL
    // =====================================================

    const closeModal = () => {
        if (saving) {
            return;
        }

        setShowModal(false);
        setEditingCourse(null);
    };

    // =====================================================
    // SAVE COURSE
    // =====================================================

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.title.trim()) {
            setError("Course title is required.");
            return;
        }

        if (!form.description.trim()) {
            setError("Course description is required.");
            return;
        }

        try {
            setSaving(true);
            setError("");

            if (editingCourse) {

                // IMPORTANT:
                // Backend returns "id", not "_id"
                await axios.put(
                    `${API_URL}/admin/courses/${editingCourse.id}`,
                    {
                        title: form.title.trim(),
                        description: form.description.trim(),
                        is_published: form.is_published
                    },
                    getConfig()
                );

            } else {

                await axios.post(
                    `${API_URL}/admin/courses`,
                    {
                        title: form.title.trim(),
                        description: form.description.trim(),
                        is_published: form.is_published
                    },
                    getConfig()
                );
            }

            setShowModal(false);
            setEditingCourse(null);

            setForm({
                title: "",
                description: "",
                is_published: false
            });

            await fetchCourses();

        } catch (err) {
            console.error("Course save error:", err);

            setError(
                err.response?.data?.detail ||
                "Failed to save course."
            );

        } finally {
            setSaving(false);
        }
    };

    // =====================================================
    // DELETE COURSE
    // =====================================================

    const handleDelete = async (course) => {

        const confirmed = window.confirm(
            `Are you sure you want to delete "${course.title}"?`
        );

        if (!confirmed) {
            return;
        }

        try {
            setError("");

            // IMPORTANT:
            // Backend returns "id", not "_id"
            await axios.delete(
                `${API_URL}/admin/courses/${course.id}`,
                getConfig()
            );

            await fetchCourses();

        } catch (err) {
            console.error("Delete course error:", err);

            setError(
                err.response?.data?.detail ||
                "Failed to delete course."
            );
        }
    };

    // =====================================================
    // STATISTICS
    // =====================================================

    const totalCourses = courses.length;

    const publishedCourses = courses.filter(
        (course) => course.is_published === true
    ).length;

    const draftCourses = totalCourses - publishedCourses;

    // =====================================================
    // UI
    // =====================================================

    return (
        <div className="min-h-screen bg-white p-8 text-slate-900">

            {/* HEADER */}

            <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                <div>
                    <p className="mb-2 text-sm font-medium text-blue-600">
                        ADMIN PANEL
                    </p>

                    <h1 className="text-4xl font-bold text-slate-900">
                        Manage Courses
                    </h1>

                    <p className="mt-2 text-slate-500">
                        Create, edit and manage your learning courses.
                    </p>
                </div>

                <button
                    onClick={openAddModal}
                    className="
                        rounded-lg
                        bg-blue-600
                        px-5
                        py-2.5
                        font-medium
                        text-white
                        transition
                        hover:bg-blue-700
                    "
                >
                    + Add Course
                </button>

            </div>

            {/* ERROR */}

            {error && !showModal && (
                <div className="
                    mb-6
                    rounded-lg
                    border
                    border-red-200
                    bg-red-50
                    px-4
                    py-3
                    text-sm
                    text-red-600
                ">
                    {error}
                </div>
            )}

            {/* STATISTICS */}

            <div className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-3">

                <div className="
                    rounded-xl
                    border
                    border-slate-200
                    bg-white
                    p-6
                    shadow-sm
                ">
                    <p className="text-sm text-slate-500">
                        Total Courses
                    </p>

                    <h2 className="mt-2 text-3xl font-bold">
                        {totalCourses}
                    </h2>
                </div>

                <div className="
                    rounded-xl
                    border
                    border-slate-200
                    bg-white
                    p-6
                    shadow-sm
                ">
                    <p className="text-sm text-slate-500">
                        Published
                    </p>

                    <h2 className="mt-2 text-3xl font-bold text-green-600">
                        {publishedCourses}
                    </h2>
                </div>

                <div className="
                    rounded-xl
                    border
                    border-slate-200
                    bg-white
                    p-6
                    shadow-sm
                ">
                    <p className="text-sm text-slate-500">
                        Drafts
                    </p>

                    <h2 className="mt-2 text-3xl font-bold text-yellow-600">
                        {draftCourses}
                    </h2>
                </div>

            </div>

            {/* COURSES */}

            <div className="
                overflow-hidden
                rounded-xl
                border
                border-slate-200
                bg-white
                shadow-sm
            ">

                <div className="border-b border-slate-200 p-6">

                    <h2 className="text-xl font-semibold">
                        All Courses
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                        Manage your available learning courses.
                    </p>

                </div>

                {/* LOADING */}

                {loading && (
                    <div className="p-10 text-center">
                        <p className="text-slate-500">
                            Loading courses...
                        </p>
                    </div>
                )}

                {/* EMPTY */}

                {!loading && courses.length === 0 && (
                    <div className="p-10 text-center">

                        <p className="text-slate-500">
                            No courses found.
                        </p>

                        <button
                            onClick={openAddModal}
                            className="
                                mt-4
                                rounded-lg
                                bg-blue-600
                                px-4
                                py-2
                                text-white
                                hover:bg-blue-700
                            "
                        >
                            Add Your First Course
                        </button>

                    </div>
                )}

                {/* COURSE LIST */}

                {!loading && courses.length > 0 && (
                    <div className="divide-y divide-slate-100">

                        {courses.map((course) => (

                            <div
                                key={course.id}
                                className="
                                    flex
                                    flex-col
                                    gap-6
                                    p-6
                                    transition
                                    hover:bg-slate-50
                                    lg:flex-row
                                    lg:items-center
                                    lg:justify-between
                                "
                            >

                                <div className="flex-1">

                                    <div className="flex flex-wrap items-center gap-3">

                                        <h3 className="text-lg font-semibold">
                                            {course.title}
                                        </h3>

                                        <span
                                            className={`
                                                rounded-full
                                                px-3
                                                py-1
                                                text-xs
                                                font-medium
                                                ${
                                                    course.is_published
                                                        ? "bg-green-50 text-green-600"
                                                        : "bg-yellow-50 text-yellow-600"
                                                }
                                            `}
                                        >
                                            {course.is_published
                                                ? "Published"
                                                : "Draft"
                                            }
                                        </span>

                                    </div>

                                    <p className="mt-2 text-slate-500">
                                        {course.description}
                                    </p>

                                </div>

                                <div className="flex gap-3">

                                    <button
                                        onClick={() =>
                                            openEditModal(course)
                                        }
                                        className="
                                            rounded-lg
                                            bg-slate-100
                                            px-4
                                            py-2
                                            text-slate-700
                                            transition
                                            hover:bg-slate-200
                                        "
                                    >
                                        Edit
                                    </button>

                                    <button
                                        onClick={() =>
                                            handleDelete(course)
                                        }
                                        className="
                                            rounded-lg
                                            bg-red-50
                                            px-4
                                            py-2
                                            text-red-600
                                            transition
                                            hover:bg-red-100
                                        "
                                    >
                                        Delete
                                    </button>

                                </div>

                            </div>

                        ))}

                    </div>
                )}

            </div>

            {/* ADD / EDIT MODAL */}

            {showModal && (

                <div className="
                    fixed
                    inset-0
                    z-50
                    flex
                    items-center
                    justify-center
                    bg-black/40
                    px-4
                ">

                    <div className="
                        w-full
                        max-w-lg
                        rounded-xl
                        bg-white
                        p-6
                        shadow-xl
                    ">

                        <div className="mb-6">

                            <h2 className="text-2xl font-semibold">
                                {editingCourse
                                    ? "Edit Course"
                                    : "Add Course"
                                }
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                {editingCourse
                                    ? "Update the course details."
                                    : "Create a new learning course."
                                }
                            </p>

                        </div>

                        {/* MODAL ERROR */}

                        {error && (
                            <div className="
                                mb-5
                                rounded-lg
                                border
                                border-red-200
                                bg-red-50
                                px-4
                                py-3
                                text-sm
                                text-red-600
                            ">
                                {error}
                            </div>
                        )}

                        <form
                            onSubmit={handleSubmit}
                            className="space-y-5"
                        >

                            {/* TITLE */}

                            <div>

                                <label className="
                                    mb-2
                                    block
                                    text-sm
                                    font-medium
                                    text-slate-700
                                ">
                                    Course Title
                                </label>

                                <input
                                    type="text"
                                    name="title"
                                    value={form.title}
                                    onChange={handleChange}
                                    placeholder="Enter course title"
                                    className="
                                        w-full
                                        rounded-lg
                                        border
                                        border-slate-300
                                        px-4
                                        py-3
                                        outline-none
                                        focus:border-blue-500
                                        focus:ring-2
                                        focus:ring-blue-100
                                    "
                                    required
                                />

                            </div>

                            {/* DESCRIPTION */}

                            <div>

                                <label className="
                                    mb-2
                                    block
                                    text-sm
                                    font-medium
                                    text-slate-700
                                ">
                                    Description
                                </label>

                                <textarea
                                    name="description"
                                    value={form.description}
                                    onChange={handleChange}
                                    placeholder="Enter course description"
                                    rows="4"
                                    className="
                                        w-full
                                        resize-none
                                        rounded-lg
                                        border
                                        border-slate-300
                                        px-4
                                        py-3
                                        outline-none
                                        focus:border-blue-500
                                        focus:ring-2
                                        focus:ring-blue-100
                                    "
                                    required
                                />

                            </div>

                            {/* PUBLISHED */}

                            <label className="
                                flex
                                cursor-pointer
                                items-center
                                gap-3
                            ">

                                <input
                                    type="checkbox"
                                    name="is_published"
                                    checked={form.is_published}
                                    onChange={handleChange}
                                    className="
                                        h-4
                                        w-4
                                        rounded
                                        border-slate-300
                                        text-blue-600
                                    "
                                />

                                <span className="text-sm text-slate-700">
                                    Publish this course
                                </span>

                            </label>

                            {/* BUTTONS */}

                            <div className="
                                flex
                                justify-end
                                gap-3
                                border-t
                                border-slate-100
                                pt-5
                            ">

                                <button
                                    type="button"
                                    onClick={closeModal}
                                    disabled={saving}
                                    className="
                                        rounded-lg
                                        bg-slate-100
                                        px-5
                                        py-2.5
                                        text-slate-700
                                        hover:bg-slate-200
                                        disabled:opacity-50
                                    "
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="
                                        rounded-lg
                                        bg-blue-600
                                        px-5
                                        py-2.5
                                        font-medium
                                        text-white
                                        hover:bg-blue-700
                                        disabled:cursor-not-allowed
                                        disabled:opacity-60
                                    "
                                >
                                    {saving
                                        ? "Saving..."
                                        : editingCourse
                                            ? "Update Course"
                                            : "Create Course"
                                    }
                                </button>

                            </div>

                        </form>

                    </div>

                </div>
            )}

        </div>
    );
};

export default ManageCourses;