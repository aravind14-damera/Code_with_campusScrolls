import os
from datetime import datetime, timezone

import cloudinary
import cloudinary.uploader

from bson import ObjectId

from dotenv import load_dotenv

from fastapi import (
    APIRouter,
    Depends,
    File,
    Form,
    HTTPException,
    UploadFile,
    status
)

from app.database import db
from app.utils.security import get_current_admin


load_dotenv()


# =========================================================
# CLOUDINARY CONFIGURATION
# =========================================================

cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET"),
    secure=True
)


router = APIRouter(
    prefix="/materials",
    tags=["Materials"]
)


# =========================================================
# CREATE / UPLOAD MATERIAL
# =========================================================

@router.post(
    "/upload",
    status_code=status.HTTP_201_CREATED
)
async def upload_material(
    topic_id: str = Form(...),
    title: str = Form(...),
    file: UploadFile = File(...),
    current_admin=Depends(get_current_admin)
):

    # -----------------------------------------------------
    # Validate Topic ID
    # -----------------------------------------------------

    try:
        topic_object_id = ObjectId(topic_id)

    except Exception:

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid topic ID"
        )


    # -----------------------------------------------------
    # Check Topic
    # -----------------------------------------------------

    topic = db.topics.find_one({
        "_id": topic_object_id,
        "is_published": True
    })

    if not topic:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Topic not found"
        )


    # -----------------------------------------------------
    # Validate PDF
    # -----------------------------------------------------

    if file.content_type != "application/pdf":

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only PDF files are allowed"
        )


    # -----------------------------------------------------
    # Upload PDF to Cloudinary
    # -----------------------------------------------------

    try:

        result = cloudinary.uploader.upload(
            file.file,
            resource_type="image",
            folder="java_learning_platform/materials",
            use_filename=True,
            unique_filename=True,
            format="pdf"
        )

    except Exception as e:

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Cloudinary upload failed: {str(e)}"
        )


    # -----------------------------------------------------
    # Save Material
    # -----------------------------------------------------

    material = {

        "topic_id": topic_object_id,

        "title": title,

        "file_url": result["secure_url"],

        "public_id": result["public_id"],

        "is_published": True,

        "created_at": datetime.now(timezone.utc),

        "updated_at": datetime.now(timezone.utc)
    }


    result_db = db.materials.insert_one(material)


    return {

        "message": "PDF uploaded successfully",

        "material_id": str(result_db.inserted_id),

        "topic_id": topic_id,

        "title": title,

        "file_url": result["secure_url"],

        "public_id": result["public_id"]
    }


# =========================================================
# GET ALL MATERIALS FOR A TOPIC
# =========================================================

@router.get("/topic/{topic_id}")
def get_topic_materials(topic_id: str):

    # -----------------------------------------------------
    # Validate Topic ID
    # -----------------------------------------------------

    try:

        topic_object_id = ObjectId(topic_id)

    except Exception:

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid topic ID"
        )


    # -----------------------------------------------------
    # Check Topic
    # -----------------------------------------------------

    topic = db.topics.find_one({
        "_id": topic_object_id,
        "is_published": True
    })

    if not topic:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Topic not found"
        )


    # -----------------------------------------------------
    # Get Materials
    # -----------------------------------------------------

    materials = list(
        db.materials.find({
            "topic_id": topic_object_id,
            "is_published": True
        }).sort("created_at", 1)
    )


    # -----------------------------------------------------
    # Response
    # -----------------------------------------------------

    return [

        {
            "id": str(material["_id"]),

            "topic_id": str(material["topic_id"]),

            "title": material["title"],

            "file_url": material["file_url"],

            "public_id": material["public_id"],

            "is_published": material.get(
                "is_published",
                True
            )
        }

        for material in materials
    ]


# =========================================================
# GET ONE MATERIAL
# =========================================================

@router.get("/{material_id}")
def get_material(material_id: str):

    try:

        object_id = ObjectId(material_id)

    except Exception:

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid material ID"
        )


    material = db.materials.find_one({
        "_id": object_id,
        "is_published": True
    })


    if not material:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Material not found"
        )


    return {

        "id": str(material["_id"]),

        "topic_id": str(material["topic_id"]),

        "title": material["title"],

        "file_url": material["file_url"],

        "public_id": material["public_id"],

        "is_published": material.get(
            "is_published",
            True
        )
    }


# =========================================================
# UPDATE MATERIAL
# =========================================================

@router.put("/{material_id}")
def update_material(
    material_id: str,
    title: str = Form(...),
    current_admin=Depends(get_current_admin)
):

    try:

        object_id = ObjectId(material_id)

    except Exception:

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid material ID"
        )


    result = db.materials.update_one(

        {
            "_id": object_id,
            "is_published": True
        },

        {
            "$set": {

                "title": title,

                "updated_at": datetime.now(timezone.utc)
            }
        }
    )


    if result.matched_count == 0:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Material not found"
        )


    return {

        "message": "Material updated successfully",

        "material_id": material_id,

        "title": title
    }


# =========================================================
# DELETE MATERIAL
# =========================================================

@router.delete("/{material_id}")
def delete_material(
    material_id: str,
    current_admin=Depends(get_current_admin)
):

    try:

        object_id = ObjectId(material_id)

    except Exception:

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid material ID"
        )


    material = db.materials.find_one({
        "_id": object_id,
        "is_published": True
    })


    if not material:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Material not found"
        )


    db.materials.update_one(

        {
            "_id": object_id
        },

        {
            "$set": {

                "is_published": False,

                "updated_at": datetime.now(timezone.utc)
            }
        }
    )


    return {

        "message": "Material deleted successfully",

        "material_id": material_id
    }