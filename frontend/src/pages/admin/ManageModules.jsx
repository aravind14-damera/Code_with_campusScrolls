import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL;

const ManageModules = () => {

    const { token } = useContext(AuthContext);

    const [modules, setModules] = useState([]);
    const [courses, setCourses] = useState([]);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");

    const [showModal, setShowModal] = useState(false);

    const [editingModule, setEditingModule] = useState(null);

    const [form, setForm] = useState({
        course_id: "",
        title: "",
        description: "",
        order: 1,
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
    // GET MODULES
    // =====================================================

    const fetchModules = async () => {

        try {

            setLoading(true);
            setError("");

            const response = await axios.get(
                `${API_URL}/admin/modules`,
                getConfig()
            );

            setModules(
                Array.isArray(response.data)
                    ? response.data
                    : []
            );

        } catch (err) {

            console.error(
                "Failed to load modules:",
                err
            );

            setError(
                err.response?.data?.detail ||
                "Failed to load modules."
            );

        } finally {

            setLoading(false);

        }

    };


    // =====================================================
    // GET COURSES
    // =====================================================

    const fetchCourses = async () => {

        try {

            const response = await axios.get(
                `${API_URL}/admin/courses`,
                getConfig()
            );

            setCourses(
                Array.isArray(response.data)
                    ? response.data
                    : []
            );

        } catch (err) {

            console.error(
                "Failed to load courses:",
                err
            );

        }

    };


    // =====================================================
    // INITIAL LOAD
    // =====================================================

    useEffect(() => {

        if (!token) {
            return;
        }

        fetchModules();
        fetchCourses();

    }, [token]);


    // =====================================================
    // FORM CHANGE
    // =====================================================

    const handleChange = (e) => {

        const {
            name,
            value,
            type,
            checked
        } = e.target;

        setForm((previous) => ({

            ...previous,

            [name]:
                type === "checkbox"
                    ? checked
                    : value

        }));

    };


    // =====================================================
    // OPEN ADD MODAL
    // =====================================================

    const openAddModal = () => {

        setEditingModule(null);

        setForm({

            course_id:
                courses.length > 0
                    ? courses[0].id
                    : "",

            title: "",

            description: "",

            order:
                modules.length + 1,

            is_published: false

        });

        setError("");

        setShowModal(true);

    };


    // =====================================================
    // OPEN EDIT MODAL
    // =====================================================

    const openEditModal = (module) => {

        setEditingModule(module);

        setForm({

            course_id:
                module.course_id || "",

            title:
                module.title || "",

            description:
                module.description || "",

            order:
                module.order || 1,

            is_published:
                module.is_published === true

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

        setEditingModule(null);

        setError("");

    };


    // =====================================================
    // SAVE MODULE
    // =====================================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (!form.course_id) {

            setError(
                "Please select a course."
            );

            return;

        }

        if (!form.title.trim()) {

            setError(
                "Module title is required."
            );

            return;

        }

        if (!form.description.trim()) {

            setError(
                "Module description is required."
            );

            return;

        }


        try {

            setSaving(true);
            setError("");

            const data = {

                course_id:
                    form.course_id,

                title:
                    form.title.trim(),

                description:
                    form.description.trim(),

                order:
                    Number(form.order),

                is_published:
                    form.is_published

            };


            if (editingModule) {

                await axios.put(

                    `${API_URL}/admin/modules/${editingModule.id}`,

                    data,

                    getConfig()

                );

            } else {

                await axios.post(

                    `${API_URL}/admin/modules`,

                    data,

                    getConfig()

                );

            }


            setShowModal(false);

            setEditingModule(null);

            setForm({

                course_id: "",

                title: "",

                description: "",

                order: 1,

                is_published: false

            });

            await fetchModules();

        } catch (err) {

            console.error(
                "Module save error:",
                err
            );

            setError(
                err.response?.data?.detail ||
                "Failed to save module."
            );

        } finally {

            setSaving(false);

        }

    };


    // =====================================================
    // DELETE MODULE
    // =====================================================

    const handleDelete = async (module) => {

        const confirmed = window.confirm(
            `Are you sure you want to permanently delete "${module.title}"?`
        );

        if (!confirmed) {
            return;
        }


        try {

            setError("");

            const response = await axios.delete(

                `${API_URL}/admin/modules/${module.id}`,

                getConfig()

            );


            console.log(
                "Delete module response:",
                response.data
            );


            // =================================================
            // REMOVE FROM UI IMMEDIATELY
            // =================================================

            setModules((previousModules) =>
                previousModules.filter(
                    (item) =>
                        String(item.id) !==
                        String(module.id)
                )
            );


            // =================================================
            // REFRESH FROM DATABASE
            // =================================================

            await fetchModules();


        } catch (err) {

            console.error(
                "Delete module error:",
                err
            );

            setError(
                err.response?.data?.detail ||
                "Failed to delete module."
            );

        }

    };


    // =====================================================
    // PUBLISH MODULE
    // =====================================================

    const handlePublish = async (module) => {

        try {

            setError("");

            await axios.patch(

                `${API_URL}/admin/modules/${module.id}/publish`,

                {},

                getConfig()

            );

            await fetchModules();

        } catch (err) {

            console.error(
                "Publish module error:",
                err
            );

            setError(
                err.response?.data?.detail ||
                "Failed to publish module."
            );

        }

    };


    // =====================================================
    // STATISTICS
    // =====================================================

    const totalModules =
        modules.length;

    const publishedModules =
        modules.filter(
            module =>
                module.is_published === true
        ).length;

    const draftModules =
        totalModules - publishedModules;


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (

            <div className="
                min-h-screen
                bg-white
                flex
                items-center
                justify-center
                text-slate-900
            ">

                <div className="text-center">

                    <div className="
                        mx-auto
                        mb-4
                        h-10
                        w-10
                        animate-spin
                        rounded-full
                        border-4
                        border-slate-200
                        border-t-purple-600
                    " />

                    <p className="text-slate-500">
                        Loading modules...
                    </p>

                </div>

            </div>

        );

    }


    // =====================================================
    // UI
    // =====================================================

    return (

        <div className="
            min-h-screen
            bg-white
            p-8
            text-slate-900
        ">


            {/* =================================================
                HEADER
            ================================================= */}

            <div className="
                mb-10
                flex
                flex-col
                gap-4
                md:flex-row
                md:items-center
                md:justify-between
            ">

                <div>

                    <p className="
                        mb-2
                        text-sm
                        font-medium
                        text-purple-600
                    ">
                        ADMIN PANEL
                    </p>

                    <h1 className="
                        text-4xl
                        font-bold
                        text-slate-900
                    ">
                        Manage Modules
                    </h1>

                    <p className="
                        mt-2
                        text-slate-500
                    ">
                        Organize modules inside your courses.
                    </p>

                </div>


                <button
                    onClick={openAddModal}
                    className="
                        rounded-lg
                        bg-purple-600
                        px-5
                        py-2.5
                        font-medium
                        text-white
                        transition
                        hover:bg-purple-700
                    "
                >
                    + Add Module
                </button>

            </div>


            {/* =================================================
                ERROR
            ================================================= */}

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


            {/* =================================================
                STATISTICS
            ================================================= */}

            <div className="
                mb-10
                grid
                grid-cols-1
                gap-6
                md:grid-cols-3
            ">


                <div className="
                    rounded-xl
                    border
                    border-slate-200
                    bg-white
                    p-6
                    shadow-sm
                ">

                    <p className="
                        text-sm
                        text-slate-500
                    ">
                        Total Modules
                    </p>

                    <h2 className="
                        mt-2
                        text-3xl
                        font-bold
                    ">
                        {totalModules}
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

                    <p className="
                        text-sm
                        text-slate-500
                    ">
                        Published
                    </p>

                    <h2 className="
                        mt-2
                        text-3xl
                        font-bold
                        text-green-600
                    ">
                        {publishedModules}
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

                    <p className="
                        text-sm
                        text-slate-500
                    ">
                        Drafts
                    </p>

                    <h2 className="
                        mt-2
                        text-3xl
                        font-bold
                        text-yellow-600
                    ">
                        {draftModules}
                    </h2>

                </div>

            </div>


            {/* =================================================
                MODULE LIST
            ================================================= */}

            <div className="
                overflow-hidden
                rounded-xl
                border
                border-slate-200
                bg-white
                shadow-sm
            ">

                <div className="
                    border-b
                    border-slate-200
                    p-6
                ">

                    <h2 className="
                        text-xl
                        font-semibold
                    ">
                        All Modules
                    </h2>

                    <p className="
                        mt-1
                        text-sm
                        text-slate-500
                    ">
                        Manage modules inside your courses.
                    </p>

                </div>


                {!loading &&
                    modules.length === 0 && (

                        <div className="
                            p-10
                            text-center
                        ">

                            <p className="
                                text-slate-500
                            ">
                                No modules found.
                            </p>

                            <button
                                onClick={openAddModal}
                                className="
                                    mt-4
                                    rounded-lg
                                    bg-purple-600
                                    px-4
                                    py-2
                                    text-white
                                    hover:bg-purple-700
                                "
                            >
                                Add Your First Module
                            </button>

                        </div>

                    )}


                {!loading &&
                    modules.length > 0 && (

                        <div className="
                            divide-y
                            divide-slate-100
                        ">

                            {modules.map(
                                (module) => (

                                    <div
                                        key={module.id}
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


                                        {/* MODULE INFORMATION */}

                                        <div className="flex-1">

                                            <div className="
                                                flex
                                                flex-wrap
                                                items-center
                                                gap-3
                                            ">

                                                <h3 className="
                                                    text-lg
                                                    font-semibold
                                                    text-slate-900
                                                ">
                                                    {module.title}
                                                </h3>


                                                <span
                                                    className={`
                                                        rounded-full
                                                        px-3
                                                        py-1
                                                        text-xs
                                                        font-medium
                                                        ${
                                                            module.is_published
                                                                ? "bg-green-50 text-green-600"
                                                                : "bg-yellow-50 text-yellow-600"
                                                        }
                                                    `}
                                                >
                                                    {module.is_published
                                                        ? "Published"
                                                        : "Draft"}
                                                </span>

                                            </div>


                                            <p className="
                                                mt-2
                                                text-slate-500
                                            ">

                                                Course:{" "}

                                                <span className="
                                                    font-medium
                                                    text-slate-700
                                                ">
                                                    {module.course_title ||
                                                        "Unknown Course"}
                                                </span>

                                            </p>


                                            <p className="
                                                mt-2
                                                text-sm
                                                text-slate-500
                                            ">
                                                Order: {module.order}
                                            </p>


                                            <p className="
                                                mt-2
                                                text-slate-500
                                            ">
                                                {module.description}
                                            </p>

                                        </div>


                                        {/* ACTIONS */}

                                        <div className="
                                            flex
                                            gap-3
                                            flex-wrap
                                        ">


                                            {/* EDIT */}

                                            <button
                                                onClick={() =>
                                                    openEditModal(module)
                                                }
                                                className="
                                                    rounded-lg
                                                    bg-slate-100
                                                    px-4
                                                    py-2
                                                    text-slate-700
                                                    hover:bg-slate-200
                                                "
                                            >
                                                Edit
                                            </button>


                                            {/* PUBLISH */}

                                            {!module.is_published && (

                                                <button
                                                    onClick={() =>
                                                        handlePublish(module)
                                                    }
                                                    className="
                                                        rounded-lg
                                                        bg-purple-50
                                                        px-4
                                                        py-2
                                                        text-purple-600
                                                        hover:bg-purple-100
                                                    "
                                                >
                                                    Publish
                                                </button>

                                            )}


                                            {/* DELETE */}

                                            <button
                                                onClick={() =>
                                                    handleDelete(module)
                                                }
                                                className="
                                                    rounded-lg
                                                    bg-red-50
                                                    px-4
                                                    py-2
                                                    text-red-600
                                                    hover:bg-red-100
                                                "
                                            >
                                                Delete
                                            </button>

                                        </div>

                                    </div>

                                )
                            )}

                        </div>

                    )}

            </div>


            {/* =================================================
                ADD / EDIT MODAL
            ================================================= */}

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

                            <h2 className="
                                text-2xl
                                font-semibold
                                text-slate-900
                            ">
                                {editingModule
                                    ? "Edit Module"
                                    : "Add Module"}
                            </h2>

                            <p className="
                                mt-1
                                text-sm
                                text-slate-500
                            ">
                                {editingModule
                                    ? "Update the module details."
                                    : "Create a new module."}
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


                            {/* COURSE */}

                            <div>

                                <label className="
                                    mb-2
                                    block
                                    text-sm
                                    font-medium
                                    text-slate-700
                                ">
                                    Course
                                </label>

                                <select
                                    name="course_id"
                                    value={form.course_id}
                                    onChange={handleChange}
                                    className="
                                        w-full
                                        rounded-lg
                                        border
                                        border-slate-300
                                        bg-white
                                        px-4
                                        py-3
                                        outline-none
                                        focus:border-purple-500
                                        focus:ring-2
                                        focus:ring-purple-100
                                    "
                                    required
                                >

                                    <option value="">
                                        Select a course
                                    </option>

                                    {courses.map(
                                        (course) => (

                                            <option
                                                key={course.id}
                                                value={course.id}
                                            >
                                                {course.title}
                                            </option>

                                        )
                                    )}

                                </select>

                            </div>


                            {/* TITLE */}

                            <div>

                                <label className="
                                    mb-2
                                    block
                                    text-sm
                                    font-medium
                                    text-slate-700
                                ">
                                    Module Title
                                </label>

                                <input
                                    type="text"
                                    name="title"
                                    value={form.title}
                                    onChange={handleChange}
                                    placeholder="Enter module title"
                                    className="
                                        w-full
                                        rounded-lg
                                        border
                                        border-slate-300
                                        px-4
                                        py-3
                                        outline-none
                                        focus:border-purple-500
                                        focus:ring-2
                                        focus:ring-purple-100
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
                                    placeholder="Enter module description"
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
                                        focus:border-purple-500
                                        focus:ring-2
                                        focus:ring-purple-100
                                    "
                                    required
                                />

                            </div>


                            {/* ORDER */}

                            <div>

                                <label className="
                                    mb-2
                                    block
                                    text-sm
                                    font-medium
                                    text-slate-700
                                ">
                                    Module Order
                                </label>

                                <input
                                    type="number"
                                    name="order"
                                    min="1"
                                    value={form.order}
                                    onChange={handleChange}
                                    className="
                                        w-full
                                        rounded-lg
                                        border
                                        border-slate-300
                                        px-4
                                        py-3
                                        outline-none
                                        focus:border-purple-500
                                        focus:ring-2
                                        focus:ring-purple-100
                                    "
                                    required
                                />

                            </div>


                            {/* PUBLISH */}

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
                                        text-purple-600
                                    "
                                />

                                <span className="
                                    text-sm
                                    text-slate-700
                                ">
                                    Publish this module
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
                                    "
                                >
                                    Cancel
                                </button>


                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="
                                        rounded-lg
                                        bg-purple-600
                                        px-5
                                        py-2.5
                                        font-medium
                                        text-white
                                        hover:bg-purple-700
                                        disabled:opacity-60
                                    "
                                >

                                    {saving
                                        ? "Saving..."
                                        : editingModule
                                            ? "Update Module"
                                            : "Create Module"}

                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

        </div>

    );

};


export default ManageModules;