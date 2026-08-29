from datetime import datetime, timezone

from bson import ObjectId

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status
)

from pydantic import BaseModel, Field

from app.database import db
from app.utils.security import get_current_admin


# =========================================================
# ROUTER
# =========================================================

router = APIRouter(
    prefix="/admin/modules",
    tags=["Admin - Modules"]
)


# =========================================================
# SCHEMAS
# =========================================================

class ModuleCreate(BaseModel):

    course_id: str = Field(...)

    title: str = Field(
        ...,
        min_length=1
    )

    description: str = Field(
        ...,
        min_length=1
    )

    order: int = Field(
        ...,
        ge=1
    )

    is_published: bool = False


# =========================================================
# GET ALL MODULES
# ADMIN ONLY
# =========================================================

@router.get("")
def get_all_modules(
    current_admin=Depends(
        get_current_admin
    )
):

    modules = list(
        db.modules.find({}).sort(
            "order",
            1
        )
    )

    result = []

    for module in modules:

        course = db.courses.find_one({
            "_id": module["course_id"]
        })

        result.append({

            "id":
                str(module["_id"]),

            "course_id":
                str(module["course_id"]),

            "course_title":
                (
                    course.get("title", "")
                    if course
                    else "Unknown Course"
                ),

            "title":
                module.get(
                    "title",
                    ""
                ),

            "description":
                module.get(
                    "description",
                    ""
                ),

            "order":
                module.get(
                    "order",
                    1
                ),

            "is_published":
                module.get(
                    "is_published",
                    False
                ),

            "created_at":
                module.get(
                    "created_at"
                ),

            "updated_at":
                module.get(
                    "updated_at"
                )

        })

    return result


# =========================================================
# CREATE MODULE
# ADMIN ONLY
# =========================================================

@router.post(
    "",
    status_code=status.HTTP_201_CREATED
)
def create_module(

    data: ModuleCreate,

    current_admin=Depends(
        get_current_admin
    )

):

    # =====================================================
    # VALIDATE COURSE ID
    # =====================================================

    try:

        course_id = ObjectId(
            data.course_id
        )

    except Exception:

        raise HTTPException(
            status_code=
                status.HTTP_400_BAD_REQUEST,
            detail=
                "Invalid course ID"
        )


    # =====================================================
    # CHECK COURSE
    # =====================================================

    course = db.courses.find_one({

        "_id":
            course_id

    })


    if not course:

        raise HTTPException(
            status_code=
                status.HTTP_404_NOT_FOUND,
            detail=
                "Course not found"
        )


    # =====================================================
    # CLEAN INPUT
    # =====================================================

    title = data.title.strip()

    description = data.description.strip()


    if not title:

        raise HTTPException(
            status_code=
                status.HTTP_400_BAD_REQUEST,
            detail=
                "Module title cannot be empty"
        )


    if not description:

        raise HTTPException(
            status_code=
                status.HTTP_400_BAD_REQUEST,
            detail=
                "Module description cannot be empty"
        )


    # =====================================================
    # CREATE MODULE
    # =====================================================

    now = datetime.now(
        timezone.utc
    )


    module = {

        "course_id":
            course_id,

        "title":
            title,

        "description":
            description,

        "order":
            data.order,

        "is_published":
            data.is_published,

        "created_at":
            now,

        "updated_at":
            now,

        "created_by":
            current_admin["_id"]

    }


    result = db.modules.insert_one(
        module
    )


    return {

        "message":
            "Module created successfully",

        "module": {

            "id":
                str(
                    result.inserted_id
                ),

            "course_id":
                data.course_id,

            "course_title":
                course.get(
                    "title",
                    ""
                ),

            "title":
                title,

            "description":
                description,

            "order":
                data.order,

            "is_published":
                data.is_published

        }

    }


# =========================================================
# UPDATE MODULE
# ADMIN ONLY
# =========================================================

@router.put("/{module_id}")
def update_module(

    module_id: str,

    data: ModuleCreate,

    current_admin=Depends(
        get_current_admin
    )

):

    # =====================================================
    # VALIDATE MODULE ID
    # =====================================================

    try:

        object_id = ObjectId(
            module_id
        )

    except Exception:

        raise HTTPException(
            status_code=400,
            detail="Invalid module ID"
        )


    # =====================================================
    # CHECK MODULE
    # =====================================================

    existing_module = db.modules.find_one({

        "_id":
            object_id

    })


    if not existing_module:

        raise HTTPException(
            status_code=404,
            detail="Module not found"
        )


    # =====================================================
    # VALIDATE COURSE ID
    # =====================================================

    try:

        course_id = ObjectId(
            data.course_id
        )

    except Exception:

        raise HTTPException(
            status_code=400,
            detail="Invalid course ID"
        )


    # =====================================================
    # CHECK COURSE
    # =====================================================

    course = db.courses.find_one({

        "_id":
            course_id

    })


    if not course:

        raise HTTPException(
            status_code=404,
            detail="Course not found"
        )


    # =====================================================
    # CLEAN INPUT
    # =====================================================

    title = data.title.strip()

    description = data.description.strip()


    if not title:

        raise HTTPException(
            status_code=400,
            detail="Module title cannot be empty"
        )


    if not description:

        raise HTTPException(
            status_code=400,
            detail="Module description cannot be empty"
        )


    # =====================================================
    # UPDATE MODULE
    # =====================================================

    result = db.modules.update_one(

        {
            "_id":
                object_id
        },

        {
            "$set": {

                "course_id":
                    course_id,

                "title":
                    title,

                "description":
                    description,

                "order":
                    data.order,

                "is_published":
                    data.is_published,

                "updated_at":
                    datetime.now(
                        timezone.utc
                    )

            }
        }

    )


    if result.matched_count == 0:

        raise HTTPException(
            status_code=404,
            detail="Module not found"
        )


    return {

        "message":
            "Module updated successfully"

    }


# =========================================================
# DELETE MODULE
# PERMANENT DELETE
# =========================================================

@router.delete("/{module_id}")
def delete_module(

    module_id: str,

    current_admin=Depends(
        get_current_admin
    )

):

    # =====================================================
    # VALIDATE MODULE ID
    # =====================================================

    try:

        object_id = ObjectId(
            module_id
        )

    except Exception:

        raise HTTPException(
            status_code=400,
            detail="Invalid module ID"
        )


    # =====================================================
    # CHECK MODULE
    # =====================================================

    module = db.modules.find_one({

        "_id":
            object_id

    })


    if not module:

        raise HTTPException(
            status_code=404,
            detail="Module not found"
        )


    # =====================================================
    # PERMANENTLY DELETE MODULE
    # =====================================================

    result = db.modules.delete_one({

        "_id":
            object_id

    })


    if result.deleted_count == 0:

        raise HTTPException(
            status_code=404,
            detail="Module could not be deleted"
        )


    # =====================================================
    # RESPONSE
    # =====================================================

    return {

        "message":
            "Module deleted successfully",

        "module_id":
            module_id

    }


# =========================================================
# PUBLISH MODULE
# ADMIN ONLY
# =========================================================

@router.patch("/{module_id}/publish")
def publish_module(

    module_id: str,

    current_admin=Depends(
        get_current_admin
    )

):

    # =====================================================
    # VALIDATE MODULE ID
    # =====================================================

    try:

        object_id = ObjectId(
            module_id
        )

    except Exception:

        raise HTTPException(
            status_code=400,
            detail="Invalid module ID"
        )


    # =====================================================
    # PUBLISH
    # =====================================================

    result = db.modules.update_one(

        {
            "_id":
                object_id
        },

        {
            "$set": {

                "is_published":
                    True,

                "updated_at":
                    datetime.now(
                        timezone.utc
                    )

            }
        }

    )


    if result.matched_count == 0:

        raise HTTPException(
            status_code=404,
            detail="Module not found"
        )


    return {

        "message":
            "Module published successfully"

    }