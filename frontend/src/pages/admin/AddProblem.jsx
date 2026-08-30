import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

const AddProblem = () => {
    const navigate = useNavigate();

    const [topics, setTopics] = useState([]);

    const [formData, setFormData] = useState({
        topic_id: "",
        title: "",
        description: "",
        difficulty: "Easy",
        order: 1,
    });

    const [pdf, setPdf] = useState(null);

    const [loadingTopics, setLoadingTopics] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    // =========================================================
    // GET TOKEN
    // =========================================================

    const getToken = () => {
        return localStorage.getItem("access_token");
    };

    // =========================================================
    // FETCH TOPICS
    // =========================================================

    const fetchTopics = async () => {
        try {
            setLoadingTopics(true);
            setError("");

            const token = getToken();

            if (!token) {
                throw new Error(
                    "Authentication token not found. Please login again."
                );
            }

            const response = await fetch(
                `${API_URL}/admin/problems/topics`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.detail || "Failed to load topics"
                );
            }

            setTopics(
                Array.isArray(data)
                    ? data
                    : []
            );

        } catch (err) {
            console.error("Error loading topics:", err);

            setError(
                err.message || "Failed to load topics"
            );

        } finally {
            setLoadingTopics(false);
        }
    };

    // =========================================================
    // LOAD TOPICS
    // =========================================================

    useEffect(() => {
        fetchTopics();
    }, []);

    // =========================================================
    // INPUT CHANGE
    // =========================================================

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    // =========================================================
    // PDF CHANGE
    // =========================================================

    const handlePdfChange = (e) => {
        const selectedFile = e.target.files?.[0];

        if (!selectedFile) {
            setPdf(null);
            return;
        }

        if (selectedFile.type !== "application/pdf") {
            setError("Only PDF files are allowed.");
            e.target.value = "";
            setPdf(null);
            return;
        }

        setError("");
        setPdf(selectedFile);
    };

    // =========================================================
    // SUBMIT
    // =========================================================

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");

        // -----------------------------------------------------
        // VALIDATION
        // -----------------------------------------------------

        if (!formData.topic_id) {
            setError("Please select a topic.");
            return;
        }

        if (!formData.title.trim()) {
            setError("Please enter a problem title.");
            return;
        }

        if (!formData.description.trim()) {
            setError("Please enter a problem description.");
            return;
        }

        if (!formData.order || Number(formData.order) < 1) {
            setError("Order must be at least 1.");
            return;
        }

        if (!pdf) {
            setError("Please upload a PDF file.");
            return;
        }

        try {
            setSubmitting(true);

            const token = getToken();

            if (!token) {
                throw new Error(
                    "Authentication token not found. Please login again."
                );
            }

            // -------------------------------------------------
            // FORM DATA
            // -------------------------------------------------

            const body = new FormData();

            body.append(
                "topic_id",
                formData.topic_id
            );

            body.append(
                "title",
                formData.title.trim()
            );

            body.append(
                "description",
                formData.description.trim()
            );

            body.append(
                "difficulty",
                formData.difficulty
            );

            body.append(
                "order",
                String(formData.order)
            );

            body.append(
                "pdf",
                pdf
            );

            // -------------------------------------------------
            // API REQUEST
            // -------------------------------------------------

            const response = await fetch(
                `${API_URL}/admin/problems`,
                {
                    method: "POST",

                    headers: {
                        Authorization:
                            `Bearer ${token}`,
                    },

                    body: body,
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.detail ||
                    "Failed to create problem"
                );
            }

            alert(
                "Problem created successfully!"
            );

            // -------------------------------------------------
            // GO BACK TO MANAGE PROBLEMS
            // -------------------------------------------------

            navigate("/admin/problems");

        } catch (err) {
            console.error(
                "Create problem error:",
                err
            );

            setError(
                err.message ||
                "Failed to create problem"
            );

        } finally {
            setSubmitting(false);
        }
    };

    // =========================================================
    // LOADING TOPICS
    // =========================================================

    if (loadingTopics) {
        return (
            <div className="
                min-h-screen
                bg-white
                text-slate-900
                flex
                items-center
                justify-center
            ">
                <div className="text-center">

                    <div className="
                        w-10
                        h-10
                        border-4
                        border-slate-200
                        border-t-orange-600
                        rounded-full
                        animate-spin
                        mx-auto
                        mb-4
                    " />

                    <p className="text-slate-500">
                        Loading topics...
                    </p>

                </div>
            </div>
        );
    }

    // =========================================================
    // MAIN UI
    // =========================================================

    return (
        <div className="
            min-h-screen
            bg-white
            text-slate-900
            p-8
        ">

            <div className="
                max-w-4xl
                mx-auto
            ">

                {/* =================================================
                    HEADER
                ================================================= */}

                <div className="
                    flex
                    items-center
                    justify-between
                    mb-8
                ">

                    <div>

                        <p className="
                            text-sm
                            text-orange-600
                            font-medium
                            mb-2
                        ">
                            ADMIN PANEL
                        </p>

                        <h1 className="
                            text-4xl
                            font-bold
                            text-slate-900
                        ">
                            Add Problem
                        </h1>

                        <p className="
                            text-slate-500
                            mt-2
                        ">
                            Create a new coding problem
                            for your students.
                        </p>

                    </div>

                    <button
                        type="button"
                        onClick={() =>
                            navigate("/admin/problems")
                        }
                        className="
                            px-5
                            py-3
                            rounded-xl
                            bg-slate-100
                            text-slate-700
                            hover:bg-slate-200
                            font-medium
                            transition
                        "
                    >
                        ← Back
                    </button>

                </div>

                {/* =================================================
                    ERROR
                ================================================= */}

                {error && (
                    <div className="
                        mb-6
                        bg-red-50
                        border
                        border-red-200
                        text-red-600
                        rounded-xl
                        p-4
                    ">
                        {error}
                    </div>
                )}

                {/* =================================================
                    FORM
                ================================================= */}

                <form
                    onSubmit={handleSubmit}
                    className="
                        bg-white
                        border
                        border-slate-200
                        rounded-2xl
                        shadow-sm
                        p-8
                    "
                >

                    {/* =================================================
                        TOPIC
                    ================================================= */}

                    <div className="mb-6">

                        <label className="
                            block
                            text-sm
                            font-semibold
                            text-slate-700
                            mb-2
                        ">
                            Topic
                        </label>

                        <select
                            name="topic_id"
                            value={formData.topic_id}
                            onChange={handleChange}
                            className="
                                w-full
                                px-4
                                py-3
                                border
                                border-slate-300
                                rounded-xl
                                bg-white
                                text-slate-900
                                focus:outline-none
                                focus:ring-2
                                focus:ring-orange-500
                            "
                        >

                            <option value="">
                                Select a topic
                            </option>

                            {topics.map((topic) => (
                                <option
                                    key={topic.id}
                                    value={topic.id}
                                >
                                    {topic.title}
                                </option>
                            ))}

                        </select>

                        {topics.length === 0 && (
                            <p className="
                                text-sm
                                text-red-500
                                mt-2
                            ">
                                No published topics found.
                            </p>
                        )}

                    </div>

                    {/* =================================================
                        TITLE
                    ================================================= */}

                    <div className="mb-6">

                        <label className="
                            block
                            text-sm
                            font-semibold
                            text-slate-700
                            mb-2
                        ">
                            Problem Title
                        </label>

                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Enter problem title"
                            className="
                                w-full
                                px-4
                                py-3
                                border
                                border-slate-300
                                rounded-xl
                                bg-white
                                text-slate-900
                                focus:outline-none
                                focus:ring-2
                                focus:ring-orange-500
                            "
                        />

                    </div>

                    {/* =================================================
                        DESCRIPTION
                    ================================================= */}

                    <div className="mb-6">

                        <label className="
                            block
                            text-sm
                            font-semibold
                            text-slate-700
                            mb-2
                        ">
                            Description
                        </label>

                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Enter problem description"
                            rows="7"
                            className="
                                w-full
                                px-4
                                py-3
                                border
                                border-slate-300
                                rounded-xl
                                bg-white
                                text-slate-900
                                resize-y
                                focus:outline-none
                                focus:ring-2
                                focus:ring-orange-500
                            "
                        />

                    </div>

                    {/* =================================================
                        DIFFICULTY + ORDER
                    ================================================= */}

                    <div className="
                        grid
                        grid-cols-1
                        md:grid-cols-2
                        gap-6
                        mb-6
                    ">

                        {/* DIFFICULTY */}

                        <div>

                            <label className="
                                block
                                text-sm
                                font-semibold
                                text-slate-700
                                mb-2
                            ">
                                Difficulty
                            </label>

                            <select
                                name="difficulty"
                                value={formData.difficulty}
                                onChange={handleChange}
                                className="
                                    w-full
                                    px-4
                                    py-3
                                    border
                                    border-slate-300
                                    rounded-xl
                                    bg-white
                                    text-slate-900
                                    focus:outline-none
                                    focus:ring-2
                                    focus:ring-orange-500
                                "
                            >

                                <option value="Easy">
                                    Easy
                                </option>

                                <option value="Medium">
                                    Medium
                                </option>

                                <option value="Hard">
                                    Hard
                                </option>

                            </select>

                        </div>

                        {/* ORDER */}

                        <div>

                            <label className="
                                block
                                text-sm
                                font-semibold
                                text-slate-700
                                mb-2
                            ">
                                Order
                            </label>

                            <input
                                type="number"
                                name="order"
                                min="1"
                                value={formData.order}
                                onChange={handleChange}
                                className="
                                    w-full
                                    px-4
                                    py-3
                                    border
                                    border-slate-300
                                    rounded-xl
                                    bg-white
                                    text-slate-900
                                    focus:outline-none
                                    focus:ring-2
                                    focus:ring-orange-500
                                "
                            />

                        </div>

                    </div>

                    {/* =================================================
                        PDF
                    ================================================= */}

                    <div className="mb-8">

                        <label className="
                            block
                            text-sm
                            font-semibold
                            text-slate-700
                            mb-2
                        ">
                            Problem PDF
                        </label>

                        <input
                            type="file"
                            accept="application/pdf,.pdf"
                            onChange={handlePdfChange}
                            className="
                                block
                                w-full
                                text-sm
                                text-slate-600
                                border
                                border-slate-300
                                rounded-xl
                                p-3
                                bg-white
                            "
                        />

                        <p className="
                            text-xs
                            text-slate-400
                            mt-2
                        ">
                            Only PDF files are allowed.
                        </p>

                        {pdf && (
                            <p className="
                                text-sm
                                text-green-600
                                mt-2
                            ">
                                Selected: {pdf.name}
                            </p>
                        )}

                    </div>

                    {/* =================================================
                        BUTTONS
                    ================================================= */}

                    <div className="
                        flex
                        justify-end
                        gap-4
                    ">

                        <button
                            type="button"
                            onClick={() =>
                                navigate("/admin/problems")
                            }
                            disabled={submitting}
                            className="
                                px-6
                                py-3
                                rounded-xl
                                bg-slate-100
                                text-slate-700
                                hover:bg-slate-200
                                font-semibold
                                transition
                                disabled:opacity-50
                            "
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={
                                submitting ||
                                topics.length === 0
                            }
                            className="
                                px-6
                                py-3
                                rounded-xl
                                bg-orange-600
                                hover:bg-orange-500
                                text-white
                                font-semibold
                                transition
                                disabled:opacity-50
                                disabled:cursor-not-allowed
                            "
                        >
                            {submitting
                                ? "Creating..."
                                : "Create Problem"}
                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
};

export default AddProblem;