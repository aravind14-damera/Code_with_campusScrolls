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
    Form
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
    secure=True
)


# =========================================================
# ROUTER
# =========================================================

router = APIRouter(
    prefix="/problems",
    tags=["Problems"]
)


# =========================================================
# CREATE PROBLEM
# PDF CONTAINS BOTH PROBLEM + SOLUTION
# ADMIN ONLY
# =========================================================

@router.post(
    "/upload",
    status_code=status.HTTP_201_CREATED
)
async def create_problem(
    topic_id: str = Form(...),
    title: str = Form(...),
    description: str = Form(...),
    difficulty: str = Form(...),
    order: int = Form(...),
    pdf: UploadFile = File(...),
    current_admin=Depends(get_current_admin)
):

    # -----------------------------------------------------
    # Validate topic ID
    # -----------------------------------------------------

    try:
        topic_object_id = ObjectId(topic_id)

    except Exception:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid topic ID"
        )


    # -----------------------------------------------------
    # Check topic
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
    # Validate difficulty
    # -----------------------------------------------------

    if difficulty not in ["Easy", "Medium", "Hard"]:

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Difficulty must be Easy, Medium or Hard"
        )


    # -----------------------------------------------------
    # Validate order
    # -----------------------------------------------------

    if order < 1:

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Order must be greater than or equal to 1"
        )


    # -----------------------------------------------------
    # Validate PDF
    # -----------------------------------------------------

    if pdf.content_type != "application/pdf":

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only PDF files are allowed"
        )


    # -----------------------------------------------------
    # Upload PDF to Cloudinary
    # -----------------------------------------------------

    try:

        result = cloudinary.uploader.upload(
            pdf.file,
            resource_type="raw",
            folder="java_learning_platform/problem_pdfs",
            use_filename=True,
            unique_filename=True
        )

    except Exception as e:

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Cloudinary upload failed: {str(e)}"
        )


    # -----------------------------------------------------
    # Create problem document
    # -----------------------------------------------------

    now = datetime.now(timezone.utc)

    problem = {

        "topic_id": topic_object_id,

        "title": title,

        "description": description,

        "difficulty": difficulty,

        "pdf_url": result["secure_url"],

        "pdf_public_id": result["public_id"],

        "order": order,

        "is_published": True,

        "created_at": now,

        "updated_at": now
    }


    # -----------------------------------------------------
    # Insert into MongoDB
    # -----------------------------------------------------

    inserted = db.problems.insert_one(problem)


    # -----------------------------------------------------
    # Response
    # -----------------------------------------------------

    return {

        "message": "Problem created successfully",

        "problem_id": str(inserted.inserted_id),

        "topic_id": topic_id,

        "title": title,

        "description": description,

        "difficulty": difficulty,

        "pdf_url": result["secure_url"],

        "pdf_public_id": result["public_id"],

        "order": order
    }


# =========================================================
# GET ALL PROBLEMS FOR A TOPIC
# PUBLIC
# =========================================================

@router.get("/topic/{topic_id}")
def get_topic_problems(topic_id: str):

    # -----------------------------------------------------
    # Validate topic ID
    # -----------------------------------------------------

    try:

        topic_object_id = ObjectId(topic_id)

    except Exception:

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid topic ID"
        )


    # -----------------------------------------------------
    # Check topic
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
    # Get problems
    # -----------------------------------------------------

    problems = list(

        db.problems.find({

            "topic_id": topic_object_id,

            "is_published": True

        }).sort("order", 1)

    )


    # -----------------------------------------------------
    # Return problems
    # -----------------------------------------------------

    return [

        {

            "id": str(problem["_id"]),

            "topic_id": str(problem["topic_id"]),

            "title": problem["title"],

            "description": problem["description"],

            "difficulty": problem["difficulty"],

            "pdf_url": problem.get("pdf_url"),

            "pdf_public_id": problem.get("pdf_public_id"),

            "order": problem.get("order", 1),

            "is_published": problem.get(
                "is_published",
                True
            )

        }

        for problem in problems

    ]


# =========================================================
# GET ONE PROBLEM
# PUBLIC
# =========================================================

@router.get("/{problem_id}")
def get_problem(problem_id: str):

    # -----------------------------------------------------
    # Validate problem ID
    # -----------------------------------------------------

    try:

        problem_object_id = ObjectId(problem_id)

    except Exception:

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid problem ID"
        )


    # -----------------------------------------------------
    # Find problem
    # -----------------------------------------------------

    problem = db.problems.find_one({

        "_id": problem_object_id,

        "is_published": True

    })


    if not problem:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Problem not found"
        )


    # -----------------------------------------------------
    # Return problem
    # -----------------------------------------------------

    return {

        "id": str(problem["_id"]),

        "topic_id": str(problem["topic_id"]),

        "title": problem["title"],

        "description": problem["description"],

        "difficulty": problem["difficulty"],

        "pdf_url": problem.get("pdf_url"),

        "pdf_public_id": problem.get("pdf_public_id"),

        "order": problem.get("order", 1),

        "is_published": problem.get(
            "is_published",
            True
        )

    }


# =========================================================
# UPDATE PROBLEM
# ADMIN ONLY
# =========================================================

@router.put("/{problem_id}")
async def update_problem(

    problem_id: str,

    topic_id: str = Form(...),

    title: str = Form(...),

    description: str = Form(...),

    difficulty: str = Form(...),

    order: int = Form(...),

    pdf: UploadFile | None = File(None),

    current_admin=Depends(get_current_admin)

):

    # -----------------------------------------------------
    # Validate problem ID
    # -----------------------------------------------------

    try:

        problem_object_id = ObjectId(problem_id)

    except Exception:

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid problem ID"
        )


    # -----------------------------------------------------
    # Validate topic ID
    # -----------------------------------------------------

    try:

        topic_object_id = ObjectId(topic_id)

    except Exception:

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid topic ID"
        )


    # -----------------------------------------------------
    # Check topic
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
    # Check problem
    # -----------------------------------------------------

    problem = db.problems.find_one({

        "_id": problem_object_id

    })


    if not problem:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Problem not found"
        )


    # -----------------------------------------------------
    # Validate difficulty
    # -----------------------------------------------------

    if difficulty not in ["Easy", "Medium", "Hard"]:

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Difficulty must be Easy, Medium or Hard"
        )


    # -----------------------------------------------------
    # Prepare update
    # -----------------------------------------------------

    update_data = {

        "topic_id": topic_object_id,

        "title": title,

        "description": description,

        "difficulty": difficulty,

        "order": order,

        "updated_at": datetime.now(timezone.utc)

    }


    # -----------------------------------------------------
    # Upload new PDF if provided
    # -----------------------------------------------------

    if pdf is not None:

        if pdf.content_type != "application/pdf":

            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Only PDF files are allowed"
            )


        try:

            result = cloudinary.uploader.upload(

                pdf.file,

                resource_type="raw",

                folder="java_learning_platform/problem_pdfs",

                use_filename=True,

                unique_filename=True

            )

        except Exception as e:

            raise HTTPException(

                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,

                detail=f"Cloudinary upload failed: {str(e)}"

            )


        update_data["pdf_url"] = result["secure_url"]

        update_data["pdf_public_id"] = result["public_id"]


    # -----------------------------------------------------
    # Update MongoDB
    # -----------------------------------------------------

    db.problems.update_one(

        {
            "_id": problem_object_id
        },

        {
            "$set": update_data
        }

    )


    return {

        "message": "Problem updated successfully",

        "problem_id": problem_id

    }


# =========================================================
# DELETE PROBLEM
# ADMIN ONLY
# =========================================================

@router.delete("/{problem_id}")
def delete_problem(

    problem_id: str,

    current_admin=Depends(get_current_admin)

):

    # -----------------------------------------------------
    # Validate ID
    # -----------------------------------------------------

    try:

        problem_object_id = ObjectId(problem_id)

    except Exception:

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid problem ID"
        )


    # -----------------------------------------------------
    # Find problem
    # -----------------------------------------------------

    problem = db.problems.find_one({

        "_id": problem_object_id,

        "is_published": True

    })


    if not problem:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Problem not found"
        )


    # -----------------------------------------------------
    # Soft delete
    # -----------------------------------------------------

    result = db.problems.update_one(

        {
            "_id": problem_object_id
        },

        {
            "$set": {

                "is_published": False,

                "updated_at": datetime.now(timezone.utc)

            }

        }

    )


    if result.matched_count == 0:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Problem not found"
        )


    return {

        "message": "Problem deleted successfully",

        "problem_id": problem_id

    }