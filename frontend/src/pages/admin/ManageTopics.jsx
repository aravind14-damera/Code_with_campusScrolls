import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://127.0.0.1:8000";

const ManageTopics = () => {
    const [topics, setTopics] = useState([]);
    const [modules, setModules] = useState([]);

    const [showModal, setShowModal] = useState(false);

    const [loadingTopics, setLoadingTopics] = useState(false);
    const [loadingModules, setLoadingModules] = useState(false);
    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        module_id: "",
        title: "",
        description: "",
        youtube_url: "",
        order: 1,
    });

    // =====================================================
    // GET TOKEN
    // =====================================================

    const getToken = () => {
        return (
            localStorage.getItem("access_token") ||
            localStorage.getItem("token")
        );
    };

    // =====================================================
    // AXIOS CONFIG
    // =====================================================

    const getConfig = () => {
        const token = getToken();

        return {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        };
    };

    // =====================================================
    // FETCH TOPICS
    // =====================================================

    const fetchTopics = async () => {
        try {
            setLoadingTopics(true);
            setError("");

            const response = await axios.get(
                `${API_URL}/admin/topics`,
                getConfig()
            );

            console.log("TOPICS RESPONSE:", response.data);

            const data = Array.isArray(response.data)
                ? response.data
                : response.data.topics || [];

            setTopics(data);

        } catch (error) {
            console.error("Error fetching topics:", error);

            setError(
                error.response?.data?.detail ||
                "Failed to load topics"
            );
        } finally {
            setLoadingTopics(false);
        }
    };

    // =====================================================
    // FETCH MODULES
    // =====================================================

    const fetchModules = async () => {
        try {
            setLoadingModules(true);

            const response = await axios.get(
                `${API_URL}/admin/modules`,
                getConfig()
            );

            console.log("MODULES RESPONSE:", response.data);

            /*
             * Backend might return:
             *
             * [
             *   {...},
             *   {...}
             * ]
             *
             * OR
             *
             * {
             *   modules: [...]
             * }
             */

            let moduleData = [];

            if (Array.isArray(response.data)) {
                moduleData = response.data;
            } else if (Array.isArray(response.data.modules)) {
                moduleData = response.data.modules;
            }

            /*
             * Topic creation requires:
             *
             * module.is_published === true
             *
             * So only published modules should be selectable.
             */

            const publishedModules = moduleData.filter(
                (module) =>
                    module.is_published === true ||
                    module.is_published === "true"
            );

            console.log("AVAILABLE MODULES:", publishedModules);

            setModules(publishedModules);

        } catch (error) {
            console.error("Error fetching modules:", error);

            setError(
                error.response?.data?.detail ||
                "Failed to load modules"
            );
        } finally {
            setLoadingModules(false);
        }
    };

    // =====================================================
    // INITIAL LOAD
    // =====================================================

    useEffect(() => {
        fetchTopics();
        fetchModules();
    }, []);

    // =====================================================
    // HANDLE INPUT
    // =====================================================

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // =====================================================
    // OPEN MODAL
    // =====================================================

    const openAddModal = () => {
        setError("");

        setFormData({
            module_id: "",
            title: "",
            description: "",
            youtube_url: "",
            order: 1,
        });

        // Refresh modules every time modal opens
        fetchModules();

        setShowModal(true);
    };

    // =====================================================
    // CLOSE MODAL
    // =====================================================

    const closeModal = () => {
        if (saving) return;

        setShowModal(false);

        setFormData({
            module_id: "",
            title: "",
            description: "",
            youtube_url: "",
            order: 1,
        });
    };

    // =====================================================
    // CREATE TOPIC
    // =====================================================

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");

        // Basic validation
        if (!formData.module_id) {
            setError("Please select a module.");
            return;
        }

        if (!formData.title.trim()) {
            setError("Please enter topic title.");
            return;
        }

        if (!formData.description.trim()) {
            setError("Please enter topic description.");
            return;
        }

        if (!formData.youtube_url.trim()) {
            setError("Please enter YouTube URL.");
            return;
        }

        try {
            setSaving(true);

            const payload = {
                module_id: formData.module_id,
                title: formData.title.trim(),
                description: formData.description.trim(),
                youtube_url: formData.youtube_url.trim(),
                order: Number(formData.order),
            };

            console.log("CREATING TOPIC:", payload);

            await axios.post(
                `${API_URL}/admin/topics`,
                payload,
                getConfig()
            );

            // Refresh topics
            await fetchTopics();

            // Close modal
            closeModal();

        } catch (error) {
            console.error("Error creating topic:", error);

            console.error(
                "Backend error:",
                error.response?.data
            );

            setError(
                error.response?.data?.detail ||
                "Failed to create topic."
            );
        } finally {
            setSaving(false);
        }
    };

    // =====================================================
    // DELETE TOPIC
    // =====================================================

    const handleDelete = async (topicId) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to permanently delete this topic?"
        );

        if (!confirmDelete) return;

        try {
            await axios.delete(
                `${API_URL}/admin/topics/${topicId}`,
                getConfig()
            );

            // Immediately remove from UI
            setTopics((prev) =>
                prev.filter((topic) => topic.id !== topicId)
            );

        } catch (error) {
            console.error("Delete error:", error);

            alert(
                error.response?.data?.detail ||
                "Failed to delete topic."
            );
        }
    };

    // =====================================================
    // STATISTICS
    // =====================================================

    const publishedCount = topics.filter(
        (topic) =>
            topic.is_published === true ||
            topic.status === "Published"
    ).length;

    const draftCount = topics.filter(
        (topic) =>
            topic.is_published === false ||
            topic.status === "Draft"
    ).length;

    // =====================================================
    // UI
    // =====================================================

    return (
        <div className="min-h-screen bg-white text-slate-900 p-8">

            {/* HEADER */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">

                <div>
                    <p className="text-sm text-cyan-600 font-medium mb-2">
                        ADMIN PANEL
                    </p>

                    <h1 className="text-4xl font-bold">
                        Manage Topics
                    </h1>

                    <p className="text-slate-500 mt-2">
                        Create and organize learning topics inside modules.
                    </p>
                </div>

                <button
                    onClick={openAddModal}
                    className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-3 rounded-xl font-semibold transition"
                >
                    + Add Topic
                </button>

            </div>

            {/* ERROR */}
            {error && !showModal && (
                <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-600">
                    {error}
                </div>
            )}

            {/* STATISTICS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">

                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                    <p className="text-slate-500 text-sm">
                        Total Topics
                    </p>

                    <h2 className="text-3xl font-bold mt-2">
                        {topics.length}
                    </h2>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                    <p className="text-slate-500 text-sm">
                        Published
                    </p>

                    <h2 className="text-3xl font-bold mt-2 text-green-600">
                        {publishedCount}
                    </h2>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                    <p className="text-slate-500 text-sm">
                        Drafts
                    </p>

                    <h2 className="text-3xl font-bold mt-2 text-yellow-600">
                        {draftCount}
                    </h2>
                </div>

            </div>

            {/* TOPICS */}
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">

                <div className="p-6 border-b border-slate-200">
                    <h2 className="text-xl font-semibold">
                        All Topics
                    </h2>

                    <p className="text-slate-500 mt-1">
                        Manage your learning topics.
                    </p>
                </div>

                {loadingTopics ? (

                    <div className="p-10 text-center text-slate-500">
                        Loading topics...
                    </div>

                ) : topics.length === 0 ? (

                    <div className="p-10 text-center text-slate-500">
                        No topics available.
                    </div>

                ) : (

                    <div className="divide-y divide-slate-200">

                        {topics.map((topic) => (

                            <div
                                key={topic.id}
                                className="p-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 hover:bg-slate-50 transition"
                            >

                                <div className="flex-1">

                                    <div className="flex flex-wrap items-center gap-3">

                                        <h3 className="text-lg font-semibold">
                                            {topic.title}
                                        </h3>

                                        <span
                                            className={`text-xs px-3 py-1 rounded-full ${
                                                topic.is_published
                                                    ? "bg-green-50 text-green-600"
                                                    : "bg-yellow-50 text-yellow-600"
                                            }`}
                                        >
                                            {topic.is_published
                                                ? "Published"
                                                : "Draft"}
                                        </span>

                                    </div>

                                    <p className="text-slate-500 mt-3">
                                        Module ID:{" "}
                                        <span className="text-slate-700">
                                            {topic.module_id}
                                        </span>
                                    </p>

                                    <p className="text-slate-500 mt-2">
                                        Order: {topic.order}
                                    </p>

                                    <p className="text-slate-500 mt-3">
                                        {topic.description}
                                    </p>

                                </div>

                                <div className="flex gap-3">

                                    <button
                                        className="px-5 py-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition"
                                    >
                                        Edit
                                    </button>

                                    <button
                                        onClick={() =>
                                            handleDelete(topic.id)
                                        }
                                        className="px-5 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition"
                                    >
                                        Delete
                                    </button>

                                </div>

                            </div>

                        ))}

                    </div>

                )}

            </div>

            {/* ================================================= */}
            {/* ADD TOPIC MODAL */}
            {/* ================================================= */}

            {showModal && (

                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">

                        <div className="p-8">

                            {/* MODAL HEADER */}

                            <div className="mb-8">

                                <h2 className="text-3xl font-bold text-slate-900">
                                    Add Topic
                                </h2>

                                <p className="text-slate-500 mt-2">
                                    Create a new learning topic.
                                </p>

                            </div>

                            {/* MODAL ERROR */}

                            {error && (

                                <div className="mb-5 p-4 rounded-xl bg-red-50 border border-red-200 text-red-600">
                                    {error}
                                </div>

                            )}

                            <form onSubmit={handleSubmit}>

                                {/* MODULE */}

                                <div className="mb-5">

                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        Module
                                    </label>

                                    <select
                                        name="module_id"
                                        value={formData.module_id}
                                        onChange={handleChange}
                                        disabled={loadingModules}
                                        className="w-full px-4 py-3 border border-slate-300 rounded-xl outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 bg-white"
                                    >

                                        <option value="">
                                            {loadingModules
                                                ? "Loading modules..."
                                                : modules.length === 0
                                                    ? "No published modules available"
                                                    : "Select a module"}
                                        </option>

                                        {modules.map((module) => (

                                            <option
                                                key={module.id}
                                                value={module.id}
                                            >
                                                {module.title}
                                            </option>

                                        ))}

                                    </select>

                                    {/* Helpful information */}

                                    {!loadingModules &&
                                        modules.length === 0 && (

                                            <p className="text-sm text-red-500 mt-2">
                                                No published modules were found.
                                                Please publish a module first.
                                            </p>

                                        )}

                                </div>

                                {/* TITLE */}

                                <div className="mb-5">

                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        Topic Title
                                    </label>

                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        placeholder="Enter topic title"
                                        className="w-full px-4 py-3 border border-slate-300 rounded-xl outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                                    />

                                </div>

                                {/* DESCRIPTION */}

                                <div className="mb-5">

                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        Description
                                    </label>

                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        placeholder="Enter topic description"
                                        rows="4"
                                        className="w-full px-4 py-3 border border-slate-300 rounded-xl outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 resize-none"
                                    />

                                </div>

                                {/* YOUTUBE */}

                                <div className="mb-5">

                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        YouTube URL
                                    </label>

                                    <input
                                        type="url"
                                        name="youtube_url"
                                        value={formData.youtube_url}
                                        onChange={handleChange}
                                        placeholder="https://youtube.com/watch?v=..."
                                        className="w-full px-4 py-3 border border-slate-300 rounded-xl outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                                    />

                                </div>

                                {/* ORDER */}

                                <div className="mb-8">

                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        Topic Order
                                    </label>

                                    <input
                                        type="number"
                                        name="order"
                                        min="1"
                                        value={formData.order}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-slate-300 rounded-xl outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                                    />

                                </div>

                                {/* BUTTONS */}

                                <div className="flex justify-end gap-3 border-t border-slate-200 pt-6">

                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        disabled={saving}
                                        className="px-5 py-3 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition"
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        type="submit"
                                        disabled={
                                            saving ||
                                            loadingModules ||
                                            modules.length === 0
                                        }
                                        className="px-6 py-3 rounded-xl bg-cyan-600 text-white font-semibold hover:bg-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                                    >
                                        {saving
                                            ? "Creating..."
                                            : "Create Topic"}
                                    </button>

                                </div>

                            </form>

                        </div>

                    </div>

                </div>

            )}

        </div>
    );
};

export default ManageTopics;