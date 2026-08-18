from datetime import datetime, timezone

from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException, status

from app.database import db
from app.schemas.course import CourseCreate
from app.utils.security import get_current_admin


router = APIRouter(
    prefix="/courses",
    tags=["Courses"]
)


# =========================================================
# CREATE COURSE - ADMIN ONLY
# =========================================================

@router.post(
    "",
    status_code=status.HTTP_201_CREATED
)
def create_course(
    data: CourseCreate,
    current_admin=Depends(get_current_admin)
):

    course = {
        "title": data.title,
        "description": data.description,
        "is_published": True,
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc)
    }

    result = db.courses.insert_one(course)

    return {
        "message": "Course created successfully",
        "course_id": str(result.inserted_id),
        "title": course["title"],
        "description": course["description"]
    }


# =========================================================
# GET ALL COURSES - PUBLIC
# =========================================================

@router.get("")
def get_courses():

    courses = list(
        db.courses.find({
            "is_published": True
        })
    )

    return [
        {
            "id": str(course["_id"]),
            "title": course["title"],
            "description": course["description"],
            "is_published": course["is_published"]
        }
        for course in courses
    ]


# =========================================================
# GET ONE COURSE - PUBLIC
# =========================================================

@router.get("/{course_id}")
def get_course(course_id: str):

    try:

        object_id = ObjectId(course_id)

    except Exception:

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid course ID"
        )

    course = db.courses.find_one({
        "_id": object_id,
        "is_published": True
    })

    if not course:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Course not found"
        )

    return {
        "id": str(course["_id"]),
        "title": course["title"],
        "description": course["description"],
        "is_published": course["is_published"]
    }


# =========================================================
# UPDATE COURSE - ADMIN ONLY
# =========================================================

@router.put("/{course_id}")
def update_course(
    course_id: str,
    data: CourseCreate,
    current_admin=Depends(get_current_admin)
):

    try:

        object_id = ObjectId(course_id)

    except Exception:

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid course ID"
        )

    result = db.courses.update_one(
        {
            "_id": object_id
        },
        {
            "$set": {
                "title": data.title,
                "description": data.description,
                "updated_at": datetime.now(timezone.utc)
            }
        }
    )

    if result.matched_count == 0:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Course not found"
        )

    return {
        "message": "Course updated successfully",
        "course_id": course_id,
        "title": data.title,
        "description": data.description
    }


# =========================================================
# DELETE COURSE - ADMIN ONLY
# =========================================================

@router.delete("/{course_id}")
def delete_course(
    course_id: str,
    current_admin=Depends(get_current_admin)
):

    try:

        object_id = ObjectId(course_id)

    except Exception:

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid course ID"
        )

    result = db.courses.update_one(
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
            detail="Course not found"
        )

    return {
        "message": "Course deleted successfully",
        "course_id": course_id
    }