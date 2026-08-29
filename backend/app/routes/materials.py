from datetime import datetime, timezone
import os

import cloudinary
import cloudinary.uploader

from bson import ObjectId

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
    UploadFile,
    File,
    Form,
)

from app.database import db
from app.utils.security import get_current_admin


# =========================================================
# CLOUDINARY CONFIGURATION
# =========================================================

cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET"),
    secure=True,
)


# =========================================================
# ROUTER
# =========================================================

router = APIRouter(
    prefix="/materials",
    tags=["Materials"],
)


# =========================================================
# GET ALL MATERIALS
# ADMIN
#
# FRONTEND CALLS:
# GET /materials/admin/all
# =========================================================

@router.get("/admin/all")
def get_all_materials(
    current_admin=Depends(get_current_admin),
):

    materials = list(
        db.materials
        .find()
        .sort("created_at", 1)
    )

    result = []

    for material in materials:

        topic = db.topics.find_one({
            "_id": material.get("topic_id")
        })

        result.append({

            "id":
                str(material["_id"]),

            "topic_id":
                str(material["topic_id"])
                if material.get("topic_id")
                else None,

            "topic":
                topic["title"]
                if topic
                else "Unknown Topic",

            "title":
                material.get(
                    "title",
                    ""
                ),

            "file_url":
                material.get(
                    "file_url"
                ),

            "public_id":
                material.get(
                    "public_id"
                ),

            "resource_type":
                material.get(
                    "resource_type",
                    "image"
                ),

            "is_published":
                material.get(
                    "is_published",
                    True
                ),

            "created_at":
                material.get(
                    "created_at"
                ),

            "updated_at":
                material.get(
                    "updated_at"
                ),
        })

    return result


# =========================================================
# GET TOPICS
# FOR ADD MATERIAL DROPDOWN
# =========================================================

@router.get("/topics")
def get_topics_for_material(
    current_admin=Depends(get_current_admin),
):

    topics = list(
        db.topics
        .find({
            "is_published": True
        })
        .sort("order", 1)
    )

    return [

        {
            "id":
                str(topic["_id"]),

            "title":
                topic.get(
                    "title",
                    ""
                ),

            "module_id":
                str(topic["module_id"])
                if topic.get("module_id")
                else None,
        }

        for topic in topics
    ]


# =========================================================
# UPLOAD MATERIAL
# ADMIN
#
# POST:
# /materials/upload
# =========================================================

@router.post(
    "/upload",
    status_code=status.HTTP_201_CREATED,
)
async def upload_material(

    topic_id: str = Form(...),

    title: str = Form(...),

    file: UploadFile = File(...),

    current_admin=Depends(
        get_current_admin
    ),
):

    # =====================================================
    # VALIDATE TOPIC ID
    # =====================================================

    try:

        topic_object_id = ObjectId(
            topic_id
        )

    except Exception:

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid topic ID",
        )


    # =====================================================
    # CHECK TOPIC
    # =====================================================

    topic = db.topics.find_one({

        "_id":
            topic_object_id,

        "is_published":
            True,
    })


    if not topic:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Topic not found",
        )


    # =====================================================
    # VALIDATE TITLE
    # =====================================================

    clean_title = title.strip()

    if not clean_title:

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Material title cannot be empty",
        )


    # =====================================================
    # VALIDATE FILE
    # =====================================================

    if not file.filename:

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Please select a PDF file",
        )


    if not file.filename.lower().endswith(".pdf"):

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only PDF files are allowed",
        )


    # =====================================================
    # CONTENT TYPE
    # =====================================================

    allowed_content_types = [

        "application/pdf",

        "application/octet-stream",
    ]


    if (
        file.content_type
        and file.content_type
        not in allowed_content_types
    ):

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only PDF files are allowed",
        )


    # =====================================================
    # UPLOAD PDF TO CLOUDINARY
    #
    # SAME STYLE AS ADMIN PROBLEMS
    #
    # resource_type = image
    # =====================================================

    try:

        upload_result = cloudinary.uploader.upload(

            file.file,

            resource_type="image",

            folder=
                "java_learning_platform/materials",

            use_filename=True,

            unique_filename=True,

        )

    except Exception as e:

        print(
            "Cloudinary material upload error:",
            str(e)
        )

        raise HTTPException(

            status_code=
                status.HTTP_500_INTERNAL_SERVER_ERROR,

            detail=
                f"Cloudinary upload failed: {str(e)}",
        )


    # =====================================================
    # CLOUDINARY RESPONSE
    # =====================================================

    file_url = upload_result.get(
        "secure_url"
    )

    public_id = upload_result.get(
        "public_id"
    )


    if not file_url:

        raise HTTPException(

            status_code=
                status.HTTP_500_INTERNAL_SERVER_ERROR,

            detail=
                "Cloudinary did not return PDF URL",
        )


    if not public_id:

        raise HTTPException(

            status_code=
                status.HTTP_500_INTERNAL_SERVER_ERROR,

            detail=
                "Cloudinary did not return PDF public ID",
        )


    # =====================================================
    # CREATE MATERIAL
    # =====================================================

    now = datetime.now(
        timezone.utc
    )


    material = {

        "topic_id":
            topic_object_id,

        "title":
            clean_title,

        "file_url":
            file_url,

        "public_id":
            public_id,

        "resource_type":
            "image",

        "is_published":
            True,

        "created_at":
            now,

        "updated_at":
            now,

        "created_by":
            current_admin["_id"],
    }


    # =====================================================
    # SAVE TO MONGODB
    # =====================================================

    inserted = db.materials.insert_one(
        material
    )


    # =====================================================
    # RESPONSE
    # =====================================================

    return {

        "message":
            "Study material uploaded successfully",

        "material_id":
            str(inserted.inserted_id),

        "topic_id":
            topic_id,

        "topic":
            topic.get(
                "title",
                ""
            ),

        "title":
            clean_title,

        "file_url":
            file_url,

        "public_id":
            public_id,

        "resource_type":
            "image",

        "is_published":
            True,
    }


# =========================================================
# GET MATERIALS FOR TOPIC
# STUDENT
#
# GET:
# /materials/topic/{topic_id}
# =========================================================

@router.get(
    "/topic/{topic_id}"
)
def get_topic_materials(
    topic_id: str,
):

    # =====================================================
    # VALIDATE TOPIC
    # =====================================================

    try:

        topic_object_id = ObjectId(
            topic_id
        )

    except Exception:

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid topic ID",
        )


    # =====================================================
    # CHECK TOPIC
    # =====================================================

    topic = db.topics.find_one({

        "_id":
            topic_object_id,

        "is_published":
            True,
    })


    if not topic:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Topic not found",
        )


    # =====================================================
    # GET MATERIALS
    # =====================================================

    materials = list(

        db.materials
        .find({

            "topic_id":
                topic_object_id,

            "is_published":
                True,

        })
        .sort(
            "created_at",
            1
        )
    )


    # =====================================================
    # RESPONSE
    # =====================================================

    return [

        {

            "id":
                str(
                    material["_id"]
                ),

            "topic_id":
                str(
                    material["topic_id"]
                ),

            "title":
                material.get(
                    "title",
                    ""
                ),

            "file_url":
                material.get(
                    "file_url"
                ),

            "public_id":
                material.get(
                    "public_id"
                ),

            "resource_type":
                material.get(
                    "resource_type",
                    "image"
                ),

            "is_published":
                material.get(
                    "is_published",
                    True
                ),
        }

        for material in materials
    ]


# =========================================================
# GET ONE MATERIAL
# STUDENT
#
# GET:
# /materials/{material_id}
# =========================================================

@router.get(
    "/{material_id}"
)
def get_material(
    material_id: str,
):

    # =====================================================
    # VALIDATE ID
    # =====================================================

    try:

        object_id = ObjectId(
            material_id
        )

    except Exception:

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid material ID",
        )


    # =====================================================
    # FIND MATERIAL
    # =====================================================

    material = db.materials.find_one({

        "_id":
            object_id,

        "is_published":
            True,
    })


    if not material:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Material not found",
        )


    # =====================================================
    # RESPONSE
    # =====================================================

    return {

        "id":
            str(
                material["_id"]
            ),

        "topic_id":
            str(
                material["topic_id"]
            ),

        "title":
            material.get(
                "title",
                ""
            ),

        "file_url":
            material.get(
                "file_url"
            ),

        "public_id":
            material.get(
                "public_id"
            ),

        "resource_type":
            material.get(
                "resource_type",
                "image"
            ),

        "is_published":
            material.get(
                "is_published",
                True
            ),
    }


# =========================================================
# UPDATE MATERIAL
# ADMIN
#
# PUT:
# /materials/{material_id}
# =========================================================

@router.put(
    "/{material_id}"
)
def update_material(

    material_id: str,

    title: str = Form(...),

    current_admin=Depends(
        get_current_admin
    ),
):

    # =====================================================
    # VALIDATE ID
    # =====================================================

    try:

        object_id = ObjectId(
            material_id
        )

    except Exception:

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid material ID",
        )


    # =====================================================
    # VALIDATE TITLE
    # =====================================================

    clean_title = title.strip()

    if not clean_title:

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Material title cannot be empty",
        )


    # =====================================================
    # CHECK MATERIAL
    # =====================================================

    material = db.materials.find_one({

        "_id":
            object_id
    })


    if not material:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Material not found",
        )


    # =====================================================
    # UPDATE
    # =====================================================

    result = db.materials.update_one(

        {
            "_id":
                object_id
        },

        {
            "$set": {

                "title":
                    clean_title,

                "updated_at":
                    datetime.now(
                        timezone.utc
                    ),
            }
        }
    )


    if result.matched_count == 0:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Material not found",
        )


    return {

        "message":
            "Material updated successfully",

        "material_id":
            material_id,

        "title":
            clean_title,
    }


# =========================================================
# DELETE MATERIAL
# ADMIN
#
# DELETE:
# /materials/{material_id}
# =========================================================

@router.delete(
    "/{material_id}"
)
def delete_material(

    material_id: str,

    current_admin=Depends(
        get_current_admin
    ),
):

    # =====================================================
    # VALIDATE ID
    # =====================================================

    try:

        object_id = ObjectId(
            material_id
        )

    except Exception:

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid material ID",
        )


    # =====================================================
    # FIND MATERIAL
    # =====================================================

    material = db.materials.find_one({

        "_id":
            object_id
    })


    if not material:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Material not found",
        )


    # =====================================================
    # GET CLOUDINARY PUBLIC ID
    # =====================================================

    public_id = material.get(
        "public_id"
    )


    # =====================================================
    # DELETE CLOUDINARY FILE
    #
    # SAME RESOURCE TYPE AS UPLOAD
    # =====================================================

    if public_id:

        try:

            cloudinary.uploader.destroy(

                public_id,

                resource_type="image"
            )

        except Exception as e:

            print(
                "Cloudinary material deletion warning:",
                str(e)
            )


    # =====================================================
    # DELETE MONGODB
    # =====================================================

    result = db.materials.delete_one({

        "_id":
            object_id
    })


    if result.deleted_count == 0:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Material could not be deleted",
        )


    # =====================================================
    # RESPONSE
    # =====================================================

    return {

        "message":
            "Study material deleted successfully",

        "material_id":
            material_id,
    }