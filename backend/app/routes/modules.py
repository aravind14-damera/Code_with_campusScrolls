from datetime import datetime, timezone

from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException, status

from app.database import db
from app.schemas.module import ModuleCreate
from app.utils.security import get_current_admin


router = APIRouter(
    prefix="/modules",
    tags=["Modules"]
)


# =========================================================
# CREATE MODULE - ADMIN ONLY
# =========================================================

@router.post(
    "",
    status_code=status.HTTP_201_CREATED
)
def create_module(
    data: ModuleCreate,
    current_admin=Depends(get_current_admin)
):

    # Validate course ID
    try:
        course_id = ObjectId(data.course_id)

    except Exception:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid course ID"
        )

    # Check course
    course = db.courses.find_one({
        "_id": course_id,
        "is_published": True
    })

    if not course:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Course not found"
        )

    # Create module
    module = {
        "course_id": course_id,
        "title": data.title,
        "description": data.description,
        "order": data.order,
        "is_published": True,
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc)
    }

    result = db.modules.insert_one(module)

    return {
        "message": "Module created successfully",
        "module_id": str(result.inserted_id),
        "course_id": data.course_id,
        "title": data.title,
        "description": data.description,
        "order": data.order
    }


# =========================================================
# GET ALL MODULES FOR A COURSE - PUBLIC
# =========================================================

@router.get("/course/{course_id}")
def get_course_modules(course_id: str):

    # Validate course ID
    try:
        object_id = ObjectId(course_id)

    except Exception:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid course ID"
        )

    # Check course
    course = db.courses.find_one({
        "_id": object_id,
        "is_published": True
    })

    if not course:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Course not found"
        )

    # Get modules
    modules = list(
        db.modules.find({
            "course_id": object_id,
            "is_published": True
        }).sort("order", 1)
    )

    return [
        {
            "id": str(module["_id"]),
            "course_id": str(module["course_id"]),
            "title": module["title"],
            "description": module["description"],
            "order": module["order"],
            "is_published": module["is_published"]
        }
        for module in modules
    ]


# =========================================================
# GET ONE MODULE - PUBLIC
# =========================================================

@router.get("/{module_id}")
def get_module(module_id: str):

    # Validate module ID
    try:
        object_id = ObjectId(module_id)

    except Exception:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid module ID"
        )

    # Find module
    module = db.modules.find_one({
        "_id": object_id,
        "is_published": True
    })

    if not module:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Module not found"
        )

    return {
        "id": str(module["_id"]),
        "course_id": str(module["course_id"]),
        "title": module["title"],
        "description": module["description"],
        "order": module["order"],
        "is_published": module["is_published"]
    }


# =========================================================
# UPDATE MODULE - ADMIN ONLY
# =========================================================

@router.put("/{module_id}")
def update_module(
    module_id: str,
    data: ModuleCreate,
    current_admin=Depends(get_current_admin)
):

    # Validate module ID
    try:
        object_id = ObjectId(module_id)

    except Exception:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid module ID"
        )

    # Validate course ID
    try:
        course_id = ObjectId(data.course_id)

    except Exception:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid course ID"
        )

    # Check course
    course = db.courses.find_one({
        "_id": course_id,
        "is_published": True
    })

    if not course:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Course not found"
        )

    # Update module
    result = db.modules.update_one(
        {
            "_id": object_id
        },
        {
            "$set": {
                "course_id": course_id,
                "title": data.title,
                "description": data.description,
                "order": data.order,
                "updated_at": datetime.now(timezone.utc)
            }
        }
    )

    if result.matched_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Module not found"
        )

    return {
        "message": "Module updated successfully",
        "module_id": module_id,
        "course_id": data.course_id,
        "title": data.title,
        "description": data.description,
        "order": data.order
    }


# =========================================================
# DELETE MODULE - ADMIN ONLY
# =========================================================

@router.delete("/{module_id}")
def delete_module(
    module_id: str,
    current_admin=Depends(get_current_admin)
):

    # Validate module ID
    try:
        object_id = ObjectId(module_id)

    except Exception:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid module ID"
        )

    # Soft delete
    result = db.modules.update_one(
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
            detail="Module not found"
        )

    return {
        "message": "Module deleted successfully",
        "module_id": module_id
    }