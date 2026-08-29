import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:8000";

const AddMaterial = () => {

    const navigate = useNavigate();

    const [topics, setTopics] = useState([]);

    const [topicId, setTopicId] = useState("");

    const [title, setTitle] = useState("");

    const [file, setFile] = useState(null);

    const [loading, setLoading] = useState(false);

    const [topicsLoading, setTopicsLoading] = useState(true);

    const [error, setError] = useState("");

    const [success, setSuccess] = useState("");


    // =====================================================
    // GET TOKEN
    // =====================================================

    const getToken = () => {

        return localStorage.getItem(
            "access_token"
        );

    };


    // =====================================================
    // FETCH TOPICS
    // =====================================================

    const fetchTopics = async () => {

        try {

            setTopicsLoading(true);

            setError("");

            const token = getToken();

            if (!token) {

                throw new Error(
                    "Authentication token not found. Please login again."
                );

            }


            /*
             * We use the existing admin topics endpoint.
             *
             * This endpoint is already being used by
             * your Problems admin page.
             */

            const response = await fetch(
                `${API_URL}/admin/problems/topics`,
                {
                    method: "GET",

                    headers: {
                        Authorization:
                            `Bearer ${token}`,
                    },
                }
            );


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.detail ||
                    "Failed to load topics"
                );

            }


            setTopics(
                Array.isArray(data)
                    ? data
                    : []
            );


        } catch (err) {

            console.error(
                "Topics error:",
                err
            );

            setError(
                err.message ||
                "Failed to load topics"
            );

        } finally {

            setTopicsLoading(false);

        }

    };


    // =====================================================
    // LOAD TOPICS
    // =====================================================

    useEffect(() => {

        fetchTopics();

    }, []);


    // =====================================================
    // FILE CHANGE
    // =====================================================

    const handleFileChange = (event) => {

        const selectedFile =
            event.target.files?.[0];


        if (!selectedFile) {

            setFile(null);

            return;

        }


        // Check PDF

        if (
            selectedFile.type !==
            "application/pdf"
        ) {

            setError(
                "Only PDF files are allowed."
            );

            setFile(null);

            event.target.value = "";

            return;

        }


        setError("");

        setFile(selectedFile);

    };


    // =====================================================
    // SUBMIT
    // =====================================================

    const handleSubmit = async (event) => {

        event.preventDefault();


        setError("");

        setSuccess("");


        // -------------------------------------------------
        // Validate topic
        // -------------------------------------------------

        if (!topicId) {

            setError(
                "Please select a topic."
            );

            return;

        }


        // -------------------------------------------------
        // Validate title
        // -------------------------------------------------

        if (!title.trim()) {

            setError(
                "Please enter a study material title."
            );

            return;

        }


        // -------------------------------------------------
        // Validate PDF
        // -------------------------------------------------

        if (!file) {

            setError(
                "Please select a PDF file."
            );

            return;

        }


        try {

            setLoading(true);


            const token = getToken();


            if (!token) {

                throw new Error(
                    "Authentication token not found. Please login again."
                );

            }


            // =================================================
            // FORM DATA
            // =================================================

            const formData =
                new FormData();


            formData.append(
                "topic_id",
                topicId
            );


            formData.append(
                "title",
                title.trim()
            );


            formData.append(
                "file",
                file
            );


            // =================================================
            // UPLOAD
            // =================================================

            const response =
                await fetch(
                    `${API_URL}/materials/upload`,
                    {
                        method: "POST",

                        headers: {
                            Authorization:
                                `Bearer ${token}`,
                        },

                        body: formData,
                    }
                );


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.detail ||
                    "Failed to upload study material"
                );

            }


            // =================================================
            // SUCCESS
            // =================================================

            setSuccess(
                "Study material uploaded successfully."
            );


            // Clear form

            setTopicId("");

            setTitle("");

            setFile(null);


            const fileInput =
                document.getElementById(
                    "material-pdf"
                );

            if (fileInput) {

                fileInput.value = "";

            }


            // Go back after short delay

            setTimeout(() => {

                navigate(
                    "/admin/materials"
                );

            }, 1000);


        } catch (err) {

            console.error(
                "Upload material error:",
                err
            );


            setError(
                err.message ||
                "Failed to upload study material"
            );


        } finally {

            setLoading(false);

        }

    };


    // =====================================================
    // UI
    // =====================================================

    return (

        <div className="
            min-h-screen
            bg-white
            text-slate-900
            p-8
        ">


            {/* =================================================
                HEADER
            ================================================= */}

            <div className="
                max-w-3xl
                mx-auto
            ">


                {/* BACK */}

                <button
                    type="button"
                    onClick={() =>
                        navigate(
                            "/admin/materials"
                        )
                    }
                    className="
                        mb-8
                        text-orange-600
                        hover:text-orange-700
                        font-medium
                    "
                >

                    ← Back to Study Materials

                </button>


                {/* =================================================
                    TITLE
                ================================================= */}

                <div className="mb-8">

                    <p className="
                        text-sm
                        text-orange-600
                        font-medium
                        mb-2
                    ">
                        ADMIN PANEL
                    </p>


                    <h1 className="
                        text-3xl
                        font-bold
                        text-slate-900
                    ">

                        Add Study Material

                    </h1>


                    <p className="
                        mt-2
                        text-slate-500
                    ">

                        Upload a PDF study material
                        for your students.

                    </p>

                </div>


                {/* =================================================
                    SUCCESS
                ================================================= */}

                {success && (

                    <div className="
                        mb-6
                        rounded-xl
                        border
                        border-green-200
                        bg-green-50
                        p-4
                        text-green-700
                    ">

                        {success}

                    </div>

                )}


                {/* =================================================
                    ERROR
                ================================================= */}

                {error && (

                    <div className="
                        mb-6
                        rounded-xl
                        border
                        border-red-200
                        bg-red-50
                        p-4
                        text-red-600
                    ">

                        {error}

                    </div>

                )}


                {/* =================================================
                    FORM CARD
                ================================================= */}

                <form
                    onSubmit={handleSubmit}
                    className="
                        bg-white
                        border
                        border-slate-200
                        rounded-2xl
                        p-8
                        shadow-sm
                    "
                >


                    {/* =================================================
                        TOPIC
                    ================================================= */}

                    <div className="mb-6">

                        <label
                            htmlFor="topic"
                            className="
                                block
                                text-sm
                                font-medium
                                text-slate-700
                                mb-2
                            "
                        >

                            Topic

                        </label>


                        <select
                            id="topic"
                            value={topicId}
                            onChange={(event) =>
                                setTopicId(
                                    event.target.value
                                )
                            }
                            disabled={
                                topicsLoading ||
                                loading
                            }
                            className="
                                w-full
                                rounded-lg
                                border
                                border-slate-300
                                bg-white
                                px-4
                                py-3
                                text-slate-900
                                outline-none
                                focus:border-orange-500
                                focus:ring-2
                                focus:ring-orange-100
                            "
                            required
                        >

                            <option value="">

                                {topicsLoading
                                    ? "Loading topics..."
                                    : "Select a topic"}

                            </option>


                            {topics.map(
                                (topic) => (

                                    <option
                                        key={topic.id}
                                        value={topic.id}
                                    >

                                        {topic.title}

                                    </option>

                                )
                            )}

                        </select>

                    </div>


                    {/* =================================================
                        TITLE
                    ================================================= */}

                    <div className="mb-6">

                        <label
                            htmlFor="title"
                            className="
                                block
                                text-sm
                                font-medium
                                text-slate-700
                                mb-2
                            "
                        >

                            Study Material Title

                        </label>


                        <input
                            id="title"
                            type="text"
                            value={title}
                            onChange={(event) =>
                                setTitle(
                                    event.target.value
                                )
                            }
                            placeholder="Example: Java OOP Concepts"
                            disabled={loading}
                            maxLength={200}
                            className="
                                w-full
                                rounded-lg
                                border
                                border-slate-300
                                bg-white
                                px-4
                                py-3
                                text-slate-900
                                outline-none
                                focus:border-orange-500
                                focus:ring-2
                                focus:ring-orange-100
                            "
                            required
                        />

                    </div>


                    {/* =================================================
                        PDF
                    ================================================= */}

                    <div className="mb-8">

                        <label
                            htmlFor="material-pdf"
                            className="
                                block
                                text-sm
                                font-medium
                                text-slate-700
                                mb-2
                            "
                        >

                            Study Material PDF

                        </label>


                        <div className="
                            rounded-xl
                            border-2
                            border-dashed
                            border-slate-300
                            bg-slate-50
                            p-8
                            text-center
                            hover:border-orange-400
                            transition
                        ">

                            <input
                                id="material-pdf"
                                type="file"
                                accept="application/pdf,.pdf"
                                onChange={
                                    handleFileChange
                                }
                                disabled={loading}
                                className="
                                    block
                                    w-full
                                    text-sm
                                    text-slate-600
                                "
                                required
                            />


                            <p className="
                                mt-3
                                text-sm
                                text-slate-500
                            ">

                                Only PDF files are allowed.

                            </p>


                            {file && (

                                <div className="
                                    mt-4
                                    rounded-lg
                                    bg-white
                                    border
                                    border-slate-200
                                    p-3
                                    text-left
                                ">

                                    <p className="
                                        text-sm
                                        font-medium
                                        text-slate-700
                                    ">

                                        Selected file:

                                    </p>


                                    <p className="
                                        mt-1
                                        text-sm
                                        text-orange-600
                                        break-all
                                    ">

                                        {file.name}

                                    </p>


                                    <p className="
                                        mt-1
                                        text-xs
                                        text-slate-400
                                    ">

                                        {(
                                            file.size /
                                            1024 /
                                            1024
                                        ).toFixed(2)}{" "}
                                        MB

                                    </p>

                                </div>

                            )}

                        </div>

                    </div>


                    {/* =================================================
                        BUTTONS
                    ================================================= */}

                    <div className="
                        flex
                        justify-end
                        gap-3
                        border-t
                        border-slate-200
                        pt-6
                    ">


                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    "/admin/materials"
                                )
                            }
                            disabled={loading}
                            className="
                                rounded-lg
                                bg-slate-100
                                px-5
                                py-3
                                font-medium
                                text-slate-700
                                hover:bg-slate-200
                                disabled:opacity-50
                            "
                        >

                            Cancel

                        </button>


                        <button
                            type="submit"
                            disabled={
                                loading ||
                                topicsLoading
                            }
                            className="
                                rounded-lg
                                bg-orange-600
                                px-6
                                py-3
                                font-semibold
                                text-white
                                hover:bg-orange-700
                                disabled:cursor-not-allowed
                                disabled:opacity-60
                            "
                        >

                            {loading
                                ? "Uploading..."
                                : "Upload Study Material"}

                        </button>

                    </div>

                </form>

            </div>

        </div>

    );

};


export default AddMaterial;