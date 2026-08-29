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
    cloud_name=os.getenv(
        "CLOUDINARY_CLOUD_NAME"
    ),
    api_key=os.getenv(
        "CLOUDINARY_API_KEY"
    ),
    api_secret=os.getenv(
        "CLOUDINARY_API_SECRET"
    ),
    secure=True
)


# =========================================================
# ROUTER
# =========================================================

router = APIRouter(
    prefix="/admin/problems",
    tags=["Admin Problems"]
)


# =========================================================
# GET ALL PROBLEMS
# ADMIN
# =========================================================

@router.get("")
def get_all_problems(
    current_admin=Depends(
        get_current_admin
    )
):

    problems = list(
        db.problems
        .find()
        .sort("order", 1)
    )

    result = []

    for problem in problems:

        topic = db.topics.find_one({
            "_id": problem.get(
                "topic_id"
            )
        })

        result.append({

            "id":
                str(problem["_id"]),

            "topic_id":
                str(
                    problem["topic_id"]
                )
                if problem.get("topic_id")
                else None,

            "topic":
                topic["title"]
                if topic
                else "Unknown Topic",

            "title":
                problem.get(
                    "title",
                    ""
                ),

            "description":
                problem.get(
                    "description",
                    ""
                ),

            "difficulty":
                problem.get(
                    "difficulty",
                    "Easy"
                ),

            "pdf_url":
                problem.get(
                    "pdf_url"
                ),

            "pdf_public_id":
                problem.get(
                    "pdf_public_id"
                ),

            "order":
                problem.get(
                    "order",
                    1
                ),

            "is_published":
                problem.get(
                    "is_published",
                    True
                )

        })

    return result


# =========================================================
# GET TOPICS
# FOR ADD PROBLEM DROPDOWN
# =========================================================

@router.get("/topics")
def get_topics_for_problem(
    current_admin=Depends(
        get_current_admin
    )
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
                topic["title"],

            "module_id":
                str(topic["module_id"])

        }

        for topic in topics

    ]


# =========================================================
# CREATE PROBLEM
# =========================================================

@router.post(
    "",
    status_code=status.HTTP_201_CREATED
)
async def create_problem(

    topic_id: str = Form(...),

    title: str = Form(...),

    description: str = Form(...),

    difficulty: str = Form(...),

    order: int = Form(...),

    pdf: UploadFile = File(...),

    current_admin=Depends(
        get_current_admin
    )

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
            status_code=
                status.HTTP_400_BAD_REQUEST,
            detail=
                "Invalid topic ID"
        )


    # =====================================================
    # CHECK TOPIC
    # =====================================================

    topic = db.topics.find_one({

        "_id":
            topic_object_id,

        "is_published":
            True

    })


    if not topic:

        raise HTTPException(
            status_code=
                status.HTTP_404_NOT_FOUND,
            detail=
                "Topic not found"
        )


    # =====================================================
    # VALIDATE DIFFICULTY
    # =====================================================

    if difficulty not in [
        "Easy",
        "Medium",
        "Hard"
    ]:

        raise HTTPException(
            status_code=
                status.HTTP_400_BAD_REQUEST,
            detail=
                "Difficulty must be Easy, Medium or Hard"
        )


    # =====================================================
    # VALIDATE ORDER
    # =====================================================

    if order < 1:

        raise HTTPException(
            status_code=
                status.HTTP_400_BAD_REQUEST,
            detail=
                "Order must be greater than or equal to 1"
        )


    # =====================================================
    # VALIDATE PDF
    # =====================================================

    if pdf.content_type != "application/pdf":

        raise HTTPException(
            status_code=
                status.HTTP_400_BAD_REQUEST,
            detail=
                "Only PDF files are allowed"
        )


    # =====================================================
    # UPLOAD PDF TO CLOUDINARY
    # =====================================================

    try:

        upload_result = (
            cloudinary.uploader.upload(

                pdf.file,

                resource_type="image",

                folder=
                    "java_learning_platform/problem_pdfs",

                use_filename=True,

                unique_filename=True

            )
        )

    except Exception as e:

        raise HTTPException(
            status_code=
                status.HTTP_500_INTERNAL_SERVER_ERROR,

            detail=
                f"Cloudinary upload failed: {str(e)}"
        )


    # =====================================================
    # CLOUDINARY RESPONSE
    # =====================================================

    pdf_url = upload_result.get(
        "secure_url"
    )

    pdf_public_id = upload_result.get(
        "public_id"
    )


    if not pdf_url:

        raise HTTPException(
            status_code=
                status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=
                "Cloudinary did not return PDF URL"
        )


    if not pdf_public_id:

        raise HTTPException(
            status_code=
                status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=
                "Cloudinary did not return PDF public ID"
        )


    # =====================================================
    # CREATE PROBLEM
    # =====================================================

    now = datetime.now(
        timezone.utc
    )


    problem = {

        "topic_id":
            topic_object_id,

        "title":
            title.strip(),

        "description":
            description.strip(),

        "difficulty":
            difficulty,

        "pdf_url":
            pdf_url,

        "pdf_public_id":
            pdf_public_id,

        "order":
            order,

        "is_published":
            True,

        "created_at":
            now,

        "updated_at":
            now

    }


    # =====================================================
    # SAVE MONGODB
    # =====================================================

    inserted = db.problems.insert_one(
        problem
    )


    # =====================================================
    # RESPONSE
    # =====================================================

    return {

        "message":
            "Problem created successfully",

        "problem_id":
            str(
                inserted.inserted_id
            ),

        "topic_id":
            topic_id,

        "topic":
            topic["title"],

        "title":
            title.strip(),

        "description":
            description.strip(),

        "difficulty":
            difficulty,

        "pdf_url":
            pdf_url,

        "pdf_public_id":
            pdf_public_id,

        "order":
            order,

        "is_published":
            True

    }


# =========================================================
# UPDATE PROBLEM
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

    current_admin=Depends(
        get_current_admin
    )

):

    # =====================================================
    # VALIDATE PROBLEM ID
    # =====================================================

    try:

        problem_object_id = ObjectId(
            problem_id
        )

    except Exception:

        raise HTTPException(
            status_code=
                status.HTTP_400_BAD_REQUEST,
            detail=
                "Invalid problem ID"
        )


    # =====================================================
    # FIND PROBLEM
    # =====================================================

    existing_problem = db.problems.find_one({

        "_id":
            problem_object_id

    })


    if not existing_problem:

        raise HTTPException(
            status_code=
                status.HTTP_404_NOT_FOUND,
            detail=
                "Problem not found"
        )


    # =====================================================
    # VALIDATE TOPIC
    # =====================================================

    try:

        topic_object_id = ObjectId(
            topic_id
        )

    except Exception:

        raise HTTPException(
            status_code=
                status.HTTP_400_BAD_REQUEST,
            detail=
                "Invalid topic ID"
        )


    topic = db.topics.find_one({

        "_id":
            topic_object_id,

        "is_published":
            True

    })


    if not topic:

        raise HTTPException(
            status_code=
                status.HTTP_404_NOT_FOUND,
            detail=
                "Topic not found"
        )


    # =====================================================
    # VALIDATE DIFFICULTY
    # =====================================================

    if difficulty not in [
        "Easy",
        "Medium",
        "Hard"
    ]:

        raise HTTPException(
            status_code=
                status.HTTP_400_BAD_REQUEST,
            detail=
                "Difficulty must be Easy, Medium or Hard"
        )


    # =====================================================
    # VALIDATE ORDER
    # =====================================================

    if order < 1:

        raise HTTPException(
            status_code=
                status.HTTP_400_BAD_REQUEST,
            detail=
                "Order must be greater than or equal to 1"
        )


    # =====================================================
    # UPDATE DATA
    # =====================================================

    update_data = {

        "topic_id":
            topic_object_id,

        "title":
            title.strip(),

        "description":
            description.strip(),

        "difficulty":
            difficulty,

        "order":
            order,

        "updated_at":
            datetime.now(
                timezone.utc
            )

    }


    # =====================================================
    # NEW PDF PROVIDED
    # =====================================================

    if pdf is not None:

        if pdf.content_type != "application/pdf":

            raise HTTPException(
                status_code=
                    status.HTTP_400_BAD_REQUEST,
                detail=
                    "Only PDF files are allowed"
            )


        # -------------------------------------------------
        # UPLOAD NEW PDF
        # -------------------------------------------------

        try:

            upload_result = (
                cloudinary.uploader.upload(

                    pdf.file,

                    resource_type="image",

                    folder=
                        "java_learning_platform/problem_pdfs",

                    use_filename=True,

                    unique_filename=True

                )
            )

        except Exception as e:

            raise HTTPException(
                status_code=
                    status.HTTP_500_INTERNAL_SERVER_ERROR,

                detail=
                    f"Cloudinary upload failed: {str(e)}"
            )


        new_pdf_url = upload_result.get(
            "secure_url"
        )

        new_pdf_public_id = upload_result.get(
            "public_id"
        )


        if not new_pdf_url:

            raise HTTPException(
                status_code=
                    status.HTTP_500_INTERNAL_SERVER_ERROR,

                detail=
                    "Cloudinary did not return PDF URL"
            )


        # -------------------------------------------------
        # DELETE OLD PDF
        # -------------------------------------------------

        old_pdf_public_id = (
            existing_problem.get(
                "pdf_public_id"
            )
        )


        if old_pdf_public_id:

            try:

                cloudinary.uploader.destroy(

                    old_pdf_public_id,

                    resource_type="image"

                )

            except Exception as e:

                print(
                    "Old Cloudinary PDF deletion failed:",
                    str(e)
                )


        # -------------------------------------------------
        # SAVE NEW PDF DATA
        # -------------------------------------------------

        update_data["pdf_url"] = (
            new_pdf_url
        )

        update_data["pdf_public_id"] = (
            new_pdf_public_id
        )


    # =====================================================
    # UPDATE MONGODB
    # =====================================================

    result = db.problems.update_one(

        {
            "_id":
                problem_object_id
        },

        {
            "$set":
                update_data
        }

    )


    if result.matched_count == 0:

        raise HTTPException(
            status_code=
                status.HTTP_404_NOT_FOUND,
            detail=
                "Problem not found"
        )


    # =====================================================
    # GET UPDATED PROBLEM
    # =====================================================

    updated_problem = db.problems.find_one({

        "_id":
            problem_object_id

    })


    # =====================================================
    # RESPONSE
    # =====================================================

    return {

        "message":
            "Problem updated successfully",

        "problem_id":
            problem_id,

        "topic_id":
            str(
                updated_problem["topic_id"]
            ),

        "topic":
            topic["title"],

        "title":
            updated_problem["title"],

        "description":
            updated_problem["description"],

        "difficulty":
            updated_problem["difficulty"],

        "pdf_url":
            updated_problem.get(
                "pdf_url"
            ),

        "pdf_public_id":
            updated_problem.get(
                "pdf_public_id"
            ),

        "order":
            updated_problem.get(
                "order",
                1
            ),

        "is_published":
            updated_problem.get(
                "is_published",
                True
            )

    }


# =========================================================
# DELETE PROBLEM
# PERMANENT DELETE
# =========================================================

@router.delete("/{problem_id}")
def delete_problem(

    problem_id: str,

    current_admin=Depends(
        get_current_admin
    )

):

    # =====================================================
    # VALIDATE PROBLEM ID
    # =====================================================

    try:

        problem_object_id = ObjectId(
            problem_id
        )

    except Exception:

        raise HTTPException(
            status_code=
                status.HTTP_400_BAD_REQUEST,
            detail=
                "Invalid problem ID"
        )


    # =====================================================
    # FIND PROBLEM
    # =====================================================

    problem = db.problems.find_one({

        "_id":
            problem_object_id

    })


    if not problem:

        raise HTTPException(
            status_code=
                status.HTTP_404_NOT_FOUND,
            detail=
                "Problem not found"
        )


    # =====================================================
    # GET CLOUDINARY PDF ID
    # =====================================================

    pdf_public_id = problem.get(
        "pdf_public_id"
    )


    # =====================================================
    # DELETE FROM MONGODB
    # =====================================================

    result = db.problems.delete_one({

        "_id":
            problem_object_id

    })


    if result.deleted_count == 0:

        raise HTTPException(
            status_code=
                status.HTTP_404_NOT_FOUND,
            detail=
                "Problem could not be deleted"
        )


    # =====================================================
    # DELETE PDF FROM CLOUDINARY
    # =====================================================

    if pdf_public_id:

        try:

            cloudinary.uploader.destroy(

                pdf_public_id,

                resource_type="image"

            )

        except Exception as e:

            print(
                "Cloudinary PDF deletion failed:",
                str(e)
            )


    # =====================================================
    # RESPONSE
    # =====================================================

    return {

        "message":
            "Problem deleted successfully",

        "problem_id":
            problem_id

    }