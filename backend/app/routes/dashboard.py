from bson import ObjectId
from fastapi import APIRouter, Depends

from app.database import db
from app.utils.security import get_current_user


router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
)


# =========================================================
# GET STUDENT DASHBOARD
# =========================================================

@router.get("")
def get_dashboard(
    current_user=Depends(get_current_user)
):

    user_id = ObjectId(current_user["_id"])

    # =====================================================
    # GET USER ENROLLMENTS
    # =====================================================

    enrollments = list(
        db.enrollments.find({
            "user_id": user_id
        })
    )

    total_courses = 0

    total_topics = 0
    completed_topics = 0

    courses = []

    # =====================================================
    # PROCESS EACH ENROLLED COURSE
    # =====================================================

    for enrollment in enrollments:

        course_id = enrollment["course_id"]

        # -------------------------------------------------
        # Get published course
        # -------------------------------------------------

        course = db.courses.find_one({
            "_id": course_id,
            "is_published": True
        })

        if not course:
            continue

        total_courses += 1

        # -------------------------------------------------
        # Get published modules
        # -------------------------------------------------

        modules = list(
            db.modules.find({
                "course_id": course_id,
                "is_published": True
            })
        )

        course_topic_count = 0
        course_completed_count = 0
        course_progress_total = 0

        # -------------------------------------------------
        # Process modules
        # -------------------------------------------------

        for module in modules:

            topics = list(
                db.topics.find({
                    "module_id": module["_id"],
                    "is_published": True
                })
            )

            # ---------------------------------------------
            # Process topics
            # ---------------------------------------------

            for topic in topics:

                total_topics += 1
                course_topic_count += 1

                progress = db.progress.find_one({
                    "user_id": user_id,
                    "topic_id": topic["_id"]
                })

                if progress:

                    percentage = progress.get(
                        "progress_percentage",
                        0
                    )

                    course_progress_total += percentage

                    if progress.get(
                        "completed",
                        False
                    ):

                        completed_topics += 1
                        course_completed_count += 1

                else:

                    percentage = 0

        # -------------------------------------------------
        # Calculate course progress
        # -------------------------------------------------

        if course_topic_count > 0:

            course_progress = round(
                course_progress_total / course_topic_count,
                2
            )

        else:

            course_progress = 0

        courses.append({
            "course_id": str(course["_id"]),
            "title": course["title"],
            "description": course["description"],
            "total_topics": course_topic_count,
            "completed_topics": course_completed_count,
            "progress_percentage": course_progress
        })

    # =====================================================
    # CALCULATE OVERALL PROGRESS
    # =====================================================

    if total_topics > 0:

        overall_progress = round(
            sum(
                course["progress_percentage"]
                * course["total_topics"]
                for course in courses
            ) / total_topics,
            2
        )

    else:

        overall_progress = 0

    # =====================================================
    # RESPONSE
    # =====================================================

    return {
        "user": {
            "id": str(current_user["_id"]),
            "name": current_user["name"],
            "email": current_user["email"],
            "role": current_user.get(
                "role",
                "student"
            )
        },

        "statistics": {
            "total_courses": total_courses,
            "total_topics": total_topics,
            "completed_topics": completed_topics,
            "overall_progress": overall_progress
        },

        "courses": courses
    }