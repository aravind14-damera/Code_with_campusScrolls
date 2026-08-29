from datetime import datetime, timezone

from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field

from app.database import db
from app.utils.security import get_current_admin


# =========================================================
# ROUTER
# =========================================================

router = APIRouter(
    prefix="/admin/courses",
    tags=["Admin - Courses"]
)


# =========================================================
# SCHEMAS
# =========================================================

class CourseCreate(BaseModel):

    title: str = Field(
        ...,
        min_length=1
    )

    description: str = Field(
        ...,
        min_length=1
    )

    is_published: bool = True


class CourseUpdate(BaseModel):

    title: str = Field(
        ...,
        min_length=1
    )

    description: str = Field(
        ...,
        min_length=1
    )

    is_published: bool = True


# =========================================================
# GET ALL COURSES
# ADMIN ONLY
# =========================================================

@router.get("")
def get_all_courses(
    current_admin=Depends(get_current_admin)
):

    courses = list(
        db.courses.find({}).sort(
            "created_at",
            -1
        )
    )

    return [
        {
            "id": str(course["_id"]),
            "title": course.get(
                "title",
                ""
            ),
            "description": course.get(
                "description",
                ""
            ),
            "is_published": course.get(
                "is_published",
                False
            ),
            "created_at": course.get(
                "created_at"
            ),
            "updated_at": course.get(
                "updated_at"
            )
        }

        for course in courses
    ]


# =========================================================
# CREATE COURSE
# ADMIN ONLY
# =========================================================

@router.post(
    "",
    status_code=status.HTTP_201_CREATED
)
def create_course(
    data: CourseCreate,
    current_admin=Depends(get_current_admin)
):

    # Clean input
    title = data.title.strip()
    description = data.description.strip()

    if not title:

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Course title cannot be empty"
        )

    if not description:

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Course description cannot be empty"
        )

    # Check duplicate title
    existing_course = db.courses.find_one({
        "title": title
    })

    if existing_course:

        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="A course with this title already exists"
        )

    # Create course
    now = datetime.now(timezone.utc)

    course = {
        "title": title,
        "description": description,
        "is_published": data.is_published,
        "created_at": now,
        "updated_at": now,
        "created_by": current_admin["_id"]
    }

    result = db.courses.insert_one(course)

    return {
        "message": "Course created successfully",
        "course": {
            "id": str(result.inserted_id),
            "title": title,
            "description": description,
            "is_published": data.is_published,
            "created_at": now,
            "updated_at": now
        }
    }


# =========================================================
# UPDATE COURSE
# ADMIN ONLY
# =========================================================

@router.put("/{course_id}")
def update_course(
    course_id: str,
    data: CourseUpdate,
    current_admin=Depends(get_current_admin)
):

    # Validate ObjectId
    try:

        object_id = ObjectId(course_id)

    except Exception:

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid course ID"
        )

    # Check course exists
    existing_course = db.courses.find_one({
        "_id": object_id
    })

    if not existing_course:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Course not found"
        )

    # Clean input
    title = data.title.strip()
    description = data.description.strip()

    if not title:

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Course title cannot be empty"
        )

    if not description:

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Course description cannot be empty"
        )

    # Check duplicate title
    duplicate = db.courses.find_one({
        "title": title,
        "_id": {
            "$ne": object_id
        }
    })

    if duplicate:

        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Another course already uses this title"
        )

    # Update
    now = datetime.now(timezone.utc)

    db.courses.update_one(
        {
            "_id": object_id
        },
        {
            "$set": {
                "title": title,
                "description": description,
                "is_published": data.is_published,
                "updated_at": now
            }
        }
    )

    # Get updated course
    updated_course = db.courses.find_one({
        "_id": object_id
    })

    return {
        "message": "Course updated successfully",
        "course": {
            "id": str(updated_course["_id"]),
            "title": updated_course.get(
                "title",
                ""
            ),
            "description": updated_course.get(
                "description",
                ""
            ),
            "is_published": updated_course.get(
                "is_published",
                False
            ),
            "created_at": updated_course.get(
                "created_at"
            ),
            "updated_at": updated_course.get(
                "updated_at"
            )
        }
    }


# =========================================================
# DELETE COURSE
# ADMIN ONLY
# =========================================================

@router.delete("/{course_id}")
def delete_course(
    course_id: str,
    current_admin=Depends(get_current_admin)
):

    # Validate ObjectId
    try:

        object_id = ObjectId(course_id)

    except Exception:

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid course ID"
        )

    # Check course exists
    existing_course = db.courses.find_one({
        "_id": object_id
    })

    if not existing_course:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Course not found"
        )

    # =====================================================
    # PERMANENTLY DELETE COURSE
    # =====================================================

    result = db.courses.delete_one({
        "_id": object_id
    })

    if result.deleted_count == 0:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Course not found"
        )

    # =====================================================
    # DELETE RELATED ENROLLMENTS
    # =====================================================

    db.enrollments.delete_many({
        "course_id": object_id
    })

    return {
        "message": "Course deleted successfully",
        "course_id": course_id
    }


# =========================================================
# PUBLISH COURSE
# ADMIN ONLY
# =========================================================

@router.patch("/{course_id}/publish")
def publish_course(
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
                "is_published": True,
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
        "message": "Course published successfully",
        "course_id": course_id
    }


# =========================================================
# UNPUBLISH COURSE
# ADMIN ONLY
# =========================================================

@router.patch("/{course_id}/unpublish")
def unpublish_course(
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
        "message": "Course unpublished successfully",
        "course_id": course_id
    }