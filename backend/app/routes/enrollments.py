from datetime import datetime, timezone

from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException, status

from app.database import db
from app.schemas.enrollment import EnrollmentCreate
from app.utils.security import get_current_user


router = APIRouter(
    prefix="/enrollments",
    tags=["Enrollments"]
)


# =========================================================
# CREATE ENROLLMENT
# =========================================================

@router.post(
    "",
    status_code=status.HTTP_201_CREATED
)
def create_enrollment(
    data: EnrollmentCreate,
    current_user=Depends(get_current_user)
):

    # -----------------------------------------------------
    # Validate course ID
    # -----------------------------------------------------

    try:
        course_id = ObjectId(data.course_id)

    except Exception:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid course ID"
        )

    # -----------------------------------------------------
    # Check course exists
    # -----------------------------------------------------

    course = db.courses.find_one({
        "_id": course_id,
        "is_published": True
    })

    if not course:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Course not found"
        )

    # -----------------------------------------------------
    # Current user
    # -----------------------------------------------------

    user_id = ObjectId(current_user["_id"])

    # -----------------------------------------------------
    # Check existing enrollment
    # -----------------------------------------------------

    existing_enrollment = db.enrollments.find_one({
        "user_id": user_id,
        "course_id": course_id
    })

    if existing_enrollment:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Already enrolled in this course"
        )

    # -----------------------------------------------------
    # Create enrollment
    # -----------------------------------------------------

    enrollment = {
        "user_id": user_id,
        "course_id": course_id,
        "enrolled_at": datetime.now(timezone.utc)
    }

    result = db.enrollments.insert_one(enrollment)

    return {
        "message": "Enrolled successfully",
        "enrollment_id": str(result.inserted_id),
        "course_id": data.course_id
    }


# =========================================================
# GET MY ENROLLMENTS
# =========================================================

@router.get("")
def get_my_enrollments(
    current_user=Depends(get_current_user)
):

    user_id = ObjectId(current_user["_id"])

    enrollments = list(
        db.enrollments.find({
            "user_id": user_id
        }).sort("enrolled_at", -1)
    )

    result = []

    for enrollment in enrollments:

        course = db.courses.find_one({
            "_id": enrollment["course_id"],
            "is_published": True
        })

        if not course:
            continue

        result.append({
            "enrollment_id": str(enrollment["_id"]),
            "course_id": str(course["_id"]),
            "title": course["title"],
            "description": course["description"],
            "enrolled_at": enrollment["enrolled_at"]
        })

    return result


# =========================================================
# GET MY ENROLLMENT FOR ONE COURSE
# =========================================================

@router.get("/{course_id}")
def get_course_enrollment(
    course_id: str,
    current_user=Depends(get_current_user)
):

    # Validate course ID
    try:
        object_id = ObjectId(course_id)

    except Exception:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid course ID"
        )

    user_id = ObjectId(current_user["_id"])

    enrollment = db.enrollments.find_one({
        "user_id": user_id,
        "course_id": object_id
    })

    if not enrollment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="You are not enrolled in this course"
        )

    return {
        "enrollment_id": str(enrollment["_id"]),
        "course_id": course_id,
        "enrolled_at": enrollment["enrolled_at"]
    }


# =========================================================
# DELETE / UNENROLL
# =========================================================

@router.delete("/{course_id}")
def delete_enrollment(
    course_id: str,
    current_user=Depends(get_current_user)
):

    # Validate course ID
    try:
        object_id = ObjectId(course_id)

    except Exception:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid course ID"
        )

    user_id = ObjectId(current_user["_id"])

    result = db.enrollments.delete_one({
        "user_id": user_id,
        "course_id": object_id
    })

    if result.deleted_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Enrollment not found"
        )

    return {
        "message": "Unenrolled successfully",
        "course_id": course_id
    }