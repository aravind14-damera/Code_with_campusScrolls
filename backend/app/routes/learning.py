from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException, status

from app.database import db
from app.utils.security import get_current_user


router = APIRouter(
    prefix="/courses",
    tags=["Learning"]
)


# =========================================================
# GET COMPLETE COURSE FOR STUDENT
# =========================================================

@router.get("/{course_id}/learning")
def get_course_learning(
    course_id: str,
    current_user=Depends(get_current_user)
):

    # -----------------------------------------------------
    # Validate course ID
    # -----------------------------------------------------

    try:
        course_object_id = ObjectId(course_id)

    except Exception:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid course ID"
        )

    # -----------------------------------------------------
    # Find course
    # -----------------------------------------------------

    course = db.courses.find_one({
        "_id": course_object_id,
        "is_published": True
    })

    if not course:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Course not found"
        )

    # -----------------------------------------------------
    # Current student
    # -----------------------------------------------------

    user_id = ObjectId(current_user["_id"])

    # -----------------------------------------------------
    # Get modules
    # -----------------------------------------------------

    modules = list(
        db.modules.find({
            "course_id": course_object_id,
            "is_published": True
        }).sort("order", 1)
    )

    module_list = []

    for module in modules:

        module_id = module["_id"]

        # -------------------------------------------------
        # Get topics
        # -------------------------------------------------

        topics = list(
            db.topics.find({
                "module_id": module_id,
                "is_published": True
            }).sort("order", 1)
        )

        topic_list = []

        for topic in topics:

            topic_id = topic["_id"]

            # ---------------------------------------------
            # Materials
            # ---------------------------------------------

            materials = list(
                db.materials.find({
                    "topic_id": topic_id,
                    "is_published": True
                }).sort("created_at", 1)
            )

            material_list = [
                {
                    "id": str(material["_id"]),
                    "title": material["title"],
                    "file_url": material["file_url"]
                }
                for material in materials
            ]

            # ---------------------------------------------
            # Problems
            # ---------------------------------------------

            problems = list(
                db.problems.find({
                    "topic_id": topic_id,
                    "is_published": True
                }).sort("order", 1)
            )

            problem_list = [
                {
                    "id": str(problem["_id"]),
                    "title": problem["title"],
                    "description": problem["description"],
                    "difficulty": problem["difficulty"],
                    "examples": problem["examples"],
                    "constraints": problem["constraints"],
                    "starter_code": problem["starter_code"],
                    "order": problem["order"],
                    "solution_pdf": problem.get("solution_pdf")
                }
                for problem in problems
            ]

            # ---------------------------------------------
            # Student progress
            # ---------------------------------------------

            progress = db.progress.find_one({
                "user_id": user_id,
                "topic_id": topic_id
            })

            if progress:

                progress_data = {
                    "completed": progress["completed"],
                    "progress_percentage": progress[
                        "progress_percentage"
                    ]
                }

            else:

                progress_data = {
                    "completed": False,
                    "progress_percentage": 0
                }

            # ---------------------------------------------
            # Topic
            # ---------------------------------------------

            topic_list.append({
                "id": str(topic["_id"]),
                "title": topic["title"],
                "description": topic["description"],
                "youtube_url": topic["youtube_url"],
                "order": topic["order"],
                "materials": material_list,
                "problems": problem_list,
                "progress": progress_data
            })

        # -------------------------------------------------
        # Module
        # -------------------------------------------------

        module_list.append({
            "id": str(module["_id"]),
            "title": module["title"],
            "description": module["description"],
            "order": module["order"],
            "topics": topic_list
        })

    # -----------------------------------------------------
    # Final response
    # -----------------------------------------------------

    return {
        "course": {
            "id": str(course["_id"]),
            "title": course["title"],
            "description": course["description"],
            "is_published": course["is_published"]
        },
        "modules": module_list
    }