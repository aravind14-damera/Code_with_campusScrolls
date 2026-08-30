import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

const ManageMaterials = () => {
    const navigate = useNavigate();

    const [materials, setMaterials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // =====================================================
    // TOKEN
    // =====================================================

    const getToken = () => {
        return localStorage.getItem("access_token");
    };

    // =====================================================
    // FETCH ALL MATERIALS
    // =====================================================

    const fetchMaterials = async () => {
        try {
            setLoading(true);
            setError("");

            const token = getToken();

            if (!token) {
                throw new Error(
                    "Authentication token not found. Please login again."
                );
            }

            const response = await fetch(
                `${API_URL}/materials/admin/all`,
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
                    data.detail ||
                    "Failed to load study materials"
                );
            }

            setMaterials(
                Array.isArray(data) ? data : []
            );

        } catch (err) {
            console.error(
                "Error loading materials:",
                err
            );

            setError(
                err.message ||
                "Failed to load study materials"
            );

        } finally {
            setLoading(false);
        }
    };

    // =====================================================
    // LOAD
    // =====================================================

    useEffect(() => {
        fetchMaterials();
    }, []);

    // =====================================================
    // DELETE MATERIAL
    // =====================================================

    const handleDelete = async (materialId) => {

        const confirmed = window.confirm(
            "Are you sure you want to permanently delete this study material?"
        );

        if (!confirmed) {
            return;
        }

        try {

            const token = getToken();

            if (!token) {
                throw new Error(
                    "Authentication token not found. Please login again."
                );
            }

            const response = await fetch(
                `${API_URL}/materials/${materialId}`,
                {
                    method: "DELETE",

                    headers: {
                        Authorization:
                            `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.detail ||
                    "Failed to delete study material"
                );
            }

            // Remove immediately from Admin UI
            setMaterials(
                (previousMaterials) =>
                    previousMaterials.filter(
                        (material) =>
                            String(material.id) !==
                            String(materialId)
                    )
            );

        } catch (err) {

            console.error(
                "Delete material error:",
                err
            );

            alert(
                err.message ||
                "Failed to delete study material"
            );
        }
    };

    // =====================================================
    // OPEN PDF
    // =====================================================

    const openPDF = (url) => {

        if (!url) {
            alert("PDF is not available.");
            return;
        }

        window.open(
            url,
            "_blank",
            "noopener,noreferrer"
        );
    };

    // =====================================================
    // STATISTICS
    // =====================================================

    const totalMaterials =
        materials.length;

    const publishedMaterials =
        materials.filter(
            (material) =>
                material.is_published === true
        ).length;

    const draftMaterials =
        materials.filter(
            (material) =>
                material.is_published === false
        ).length;

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

                    <p className="
                        text-slate-500
                    ">
                        Loading study materials...
                    </p>

                </div>

            </div>
        );
    }

    // =====================================================
    // MAIN
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
                flex
                flex-col
                md:flex-row
                md:items-center
                md:justify-between
                gap-4
                mb-10
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
                        Manage Study Materials
                    </h1>

                    <p className="
                        text-slate-500
                        mt-2
                    ">
                        Upload and manage study material
                        PDFs for your students.
                    </p>

                </div>

                <button
                    onClick={() =>
                        navigate(
                            "/admin/materials/add"
                        )
                    }
                    className="
                        bg-orange-600
                        hover:bg-orange-500
                        text-white
                        px-6
                        py-3
                        rounded-xl
                        font-semibold
                        transition
                        duration-300
                        hover:-translate-y-1
                        hover:shadow-lg
                    "
                >
                    + Add Study Material
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
                STATISTICS
            ================================================= */}

            <div className="
                grid
                grid-cols-1
                md:grid-cols-3
                gap-6
                mb-10
            ">

                {/* TOTAL */}

                <div className="
                    bg-white
                    border
                    border-slate-200
                    rounded-2xl
                    p-6
                    shadow-sm
                ">

                    <p className="
                        text-slate-500
                        text-sm
                    ">
                        Total Materials
                    </p>

                    <h2 className="
                        text-3xl
                        font-bold
                        mt-2
                        text-slate-900
                    ">
                        {totalMaterials}
                    </h2>

                </div>

                {/* PUBLISHED */}

                <div className="
                    bg-white
                    border
                    border-slate-200
                    rounded-2xl
                    p-6
                    shadow-sm
                ">

                    <p className="
                        text-slate-500
                        text-sm
                    ">
                        Published
                    </p>

                    <h2 className="
                        text-3xl
                        font-bold
                        mt-2
                        text-green-600
                    ">
                        {publishedMaterials}
                    </h2>

                </div>

                {/* DRAFT */}

                <div className="
                    bg-white
                    border
                    border-slate-200
                    rounded-2xl
                    p-6
                    shadow-sm
                ">

                    <p className="
                        text-slate-500
                        text-sm
                    ">
                        Drafts
                    </p>

                    <h2 className="
                        text-3xl
                        font-bold
                        mt-2
                        text-yellow-600
                    ">
                        {draftMaterials}
                    </h2>

                </div>

            </div>

            {/* =================================================
                ALL MATERIALS
            ================================================= */}

            <div className="
                bg-white
                border
                border-slate-200
                rounded-2xl
                overflow-hidden
                shadow-sm
            ">

                {/* HEADER */}

                <div className="
                    p-6
                    border-b
                    border-slate-200
                ">

                    <h2 className="
                        text-xl
                        font-semibold
                        text-slate-900
                    ">
                        All Study Materials
                    </h2>

                    <p className="
                        text-slate-500
                        mt-1
                    ">
                        Manage your study material PDFs.
                    </p>

                </div>

                {/* =================================================
                    EMPTY
                ================================================= */}

                {materials.length === 0 && (

                    <div className="
                        p-12
                        text-center
                    ">

                        <p className="
                            text-lg
                            font-medium
                            text-slate-700
                        ">
                            No study materials found
                        </p>

                        <p className="
                            mt-2
                            text-sm
                            text-slate-500
                        ">
                            Click "Add Study Material"
                            to upload your first PDF.
                        </p>

                    </div>

                )}

                {/* =================================================
                    MATERIAL LIST
                ================================================= */}

                {materials.length > 0 && (

                    <div className="
                        divide-y
                        divide-slate-200
                    ">

                        {materials.map(
                            (material) => (

                                <div
                                    key={material.id}
                                    className="
                                        p-6
                                        flex
                                        flex-col
                                        lg:flex-row
                                        lg:items-center
                                        lg:justify-between
                                        gap-6
                                        hover:bg-slate-50
                                        transition
                                    "
                                >

                                    {/* INFORMATION */}

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
                                                {material.title}
                                            </h3>

                                            <span
                                                className={`
                                                    text-xs
                                                    px-3
                                                    py-1
                                                    rounded-full
                                                    font-medium
                                                    ${
                                                        material.is_published
                                                            ? "bg-blue-100 text-blue-700"
                                                            : "bg-yellow-100 text-yellow-700"
                                                    }
                                                `}
                                            >
                                                {material.is_published
                                                    ? "Published"
                                                    : "Draft"}
                                            </span>

                                        </div>

                                        <p className="
                                            text-slate-500
                                            mt-2
                                        ">

                                            Topic:{" "}

                                            <span className="
                                                text-slate-700
                                                font-medium
                                            ">
                                                {material.topic ||
                                                    "Unknown Topic"}
                                            </span>

                                        </p>

                                        {/* PDF */}

                                        {material.file_url && (

                                            <button
                                                onClick={() =>
                                                    openPDF(
                                                        material.file_url
                                                    )
                                                }
                                                className="
                                                    mt-4
                                                    text-orange-600
                                                    hover:text-orange-700
                                                    font-medium
                                                    text-sm
                                                "
                                            >
                                                📄 View Study Material PDF →
                                            </button>

                                        )}

                                    </div>

                                    {/* ACTIONS */}

                                    <div className="
                                        flex
                                        gap-3
                                    ">

                                        <button
                                            onClick={() =>
                                                navigate(
                                                    `/admin/materials/edit/${material.id}`
                                                )
                                            }
                                            className="
                                                px-4
                                                py-2
                                                rounded-lg
                                                bg-slate-100
                                                text-slate-700
                                                hover:bg-slate-200
                                                transition
                                                font-medium
                                            "
                                        >
                                            Edit
                                        </button>

                                        <button
                                            onClick={() =>
                                                handleDelete(
                                                    material.id
                                                )
                                            }
                                            className="
                                                px-4
                                                py-2
                                                rounded-lg
                                                bg-red-50
                                                text-red-600
                                                hover:bg-red-100
                                                transition
                                                font-medium
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

        </div>
    );
};

export default ManageMaterials;