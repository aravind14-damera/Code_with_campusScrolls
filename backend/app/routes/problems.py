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
    HTTPException,
    UploadFile,
    status
)

from app.database import db
from app.schemas.problem import ProblemCreate
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
    prefix="/problems",
    tags=["Problems"]
)


# =========================================================
# CREATE PROBLEM - ADMIN ONLY
# =========================================================

@router.post(
    "",
    status_code=status.HTTP_201_CREATED
)
def create_problem(
    data: ProblemCreate,
    current_admin=Depends(get_current_admin)
):

    # Validate topic ID
    try:
        topic_id = ObjectId(data.topic_id)

    except Exception:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid topic ID"
        )

    # Check topic
    topic = db.topics.find_one({
        "_id": topic_id,
        "is_published": True
    })

    if not topic:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Topic not found"
        )

    problem = {
        "topic_id": topic_id,
        "title": data.title,
        "description": data.description,
        "difficulty": data.difficulty,

        "examples": [
            example.model_dump()
            for example in data.examples
        ],

        "constraints": data.constraints,

        "starter_code": data.starter_code,

        "order": data.order,

        "is_published": True,

        "solution_pdf": None,

        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc)
    }

    result = db.problems.insert_one(problem)

    return {
        "message": "Problem created successfully",
        "problem_id": str(result.inserted_id),
        "topic_id": data.topic_id,
        "title": data.title,
        "difficulty": data.difficulty,
        "order": data.order
    }


# =========================================================
# GET ALL PROBLEMS FOR A TOPIC - PUBLIC
# =========================================================

@router.get("/topic/{topic_id}")
def get_topic_problems(topic_id: str):

    try:
        object_id = ObjectId(topic_id)

    except Exception:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid topic ID"
        )

    topic = db.topics.find_one({
        "_id": object_id,
        "is_published": True
    })

    if not topic:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Topic not found"
        )

    problems = list(
        db.problems.find({
            "topic_id": object_id,
            "is_published": True
        }).sort("order", 1)
    )

    return [
        {
            "id": str(problem["_id"]),
            "topic_id": str(problem["topic_id"]),
            "title": problem["title"],
            "description": problem["description"],
            "difficulty": problem["difficulty"],
            "examples": problem["examples"],
            "constraints": problem["constraints"],
            "starter_code": problem["starter_code"],
            "order": problem["order"],
            "is_published": problem["is_published"],
            "solution_pdf": problem.get("solution_pdf")
        }
        for problem in problems
    ]


# =========================================================
# GET ONE PROBLEM - PUBLIC
# =========================================================

@router.get("/{problem_id}")
def get_problem(problem_id: str):

    try:
        object_id = ObjectId(problem_id)

    except Exception:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid problem ID"
        )

    problem = db.problems.find_one({
        "_id": object_id,
        "is_published": True
    })

    if not problem:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Problem not found"
        )

    return {
        "id": str(problem["_id"]),
        "topic_id": str(problem["topic_id"]),
        "title": problem["title"],
        "description": problem["description"],
        "difficulty": problem["difficulty"],
        "examples": problem["examples"],
        "constraints": problem["constraints"],
        "starter_code": problem["starter_code"],
        "order": problem["order"],
        "is_published": problem["is_published"],
        "solution_pdf": problem.get("solution_pdf")
    }


# =========================================================
# UPDATE PROBLEM - ADMIN ONLY
# =========================================================

@router.put("/{problem_id}")
def update_problem(
    problem_id: str,
    data: ProblemCreate,
    current_admin=Depends(get_current_admin)
):

    # Validate problem ID
    try:
        problem_object_id = ObjectId(problem_id)

    except Exception:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid problem ID"
        )

    # Validate topic ID
    try:
        topic_id = ObjectId(data.topic_id)

    except Exception:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid topic ID"
        )

    # Check topic
    topic = db.topics.find_one({
        "_id": topic_id,
        "is_published": True
    })

    if not topic:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Topic not found"
        )

    result = db.problems.update_one(
        {
            "_id": problem_object_id
        },
        {
            "$set": {
                "topic_id": topic_id,
                "title": data.title,
                "description": data.description,
                "difficulty": data.difficulty,

                "examples": [
                    example.model_dump()
                    for example in data.examples
                ],

                "constraints": data.constraints,

                "starter_code": data.starter_code,

                "order": data.order,

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
        "message": "Problem updated successfully",
        "problem_id": problem_id,
        "topic_id": data.topic_id,
        "title": data.title,
        "difficulty": data.difficulty,
        "order": data.order
    }


# =========================================================
# DELETE PROBLEM - ADMIN ONLY
# =========================================================

@router.delete("/{problem_id}")
def delete_problem(
    problem_id: str,
    current_admin=Depends(get_current_admin)
):

    try:
        object_id = ObjectId(problem_id)

    except Exception:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid problem ID"
        )

    result = db.problems.update_one(
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

    if result.matched_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Problem not found"
        )

    return {
        "message": "Problem deleted successfully",
        "problem_id": problem_id
    }


# =========================================================
# UPLOAD SOLUTION PDF - ADMIN ONLY
# =========================================================

@router.post(
    "/{problem_id}/solution-upload",
    status_code=status.HTTP_201_CREATED
)
async def upload_solution_pdf(
    problem_id: str,
    file: UploadFile = File(...),
    current_admin=Depends(get_current_admin)
):

    # Validate problem ID
    try:
        object_id = ObjectId(problem_id)

    except Exception:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid problem ID"
        )

    # Check problem
    problem = db.problems.find_one({
        "_id": object_id,
        "is_published": True
    })

    if not problem:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Problem not found"
        )

    # Check PDF
    if file.content_type != "application/pdf":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only PDF files are allowed"
        )

    # Upload to Cloudinary
    try:

        result = cloudinary.uploader.upload(
            file.file,
            resource_type="image",
            folder="java_learning_platform/problem_solutions",
            use_filename=True,
            unique_filename=True,
            format="pdf"
        )

    except Exception as e:

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Cloudinary upload failed: {str(e)}"
        )

    solution_pdf = {
        "title": f"{problem['title']} - Solution",
        "file_url": result["secure_url"],
        "public_id": result["public_id"]
    }

    # Save solution information
    db.problems.update_one(
        {
            "_id": object_id
        },
        {
            "$set": {
                "solution_pdf": solution_pdf,
                "updated_at": datetime.now(timezone.utc)
            }
        }
    )

    return {
        "message": "Solution PDF uploaded successfully",
        "problem_id": problem_id,
        "solution_pdf": solution_pdf
    }


# =========================================================
# DELETE SOLUTION PDF - ADMIN ONLY
# =========================================================

@router.delete("/{problem_id}/solution")
def delete_solution_pdf(
    problem_id: str,
    current_admin=Depends(get_current_admin)
):

    try:
        object_id = ObjectId(problem_id)

    except Exception:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid problem ID"
        )

    problem = db.problems.find_one({
        "_id": object_id,
        "is_published": True
    })

    if not problem:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Problem not found"
        )

    solution_pdf = problem.get("solution_pdf")

    if not solution_pdf:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Solution PDF not found"
        )

    # Delete from Cloudinary
    try:

        cloudinary.uploader.destroy(
            solution_pdf["public_id"],
            resource_type="image"
        )

    except Exception as e:

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Cloudinary delete failed: {str(e)}"
        )

    # Remove from MongoDB
    db.problems.update_one(
        {
            "_id": object_id
        },
        {
            "$set": {
                "solution_pdf": None,
                "updated_at": datetime.now(timezone.utc)
            }
        }
    )

    return {
        "message": "Solution PDF deleted successfully",
        "problem_id": problem_id
    }