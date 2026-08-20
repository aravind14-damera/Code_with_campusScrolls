from datetime import datetime, timezone

from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException, status

from app.database import db
from app.schemas.progress import ProgressUpdate
from app.utils.security import get_current_user


router = APIRouter(
    prefix="/progress",
    tags=["Progress"]
)


# =========================================================
# CREATE / UPDATE PROGRESS
# =========================================================

@router.post("")
def create_or_update_progress(
    data: ProgressUpdate,
    current_user=Depends(get_current_user)
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

    user_id = ObjectId(current_user["_id"])
    now = datetime.now(timezone.utc)

    # Check existing progress
    existing_progress = db.progress.find_one({
        "user_id": user_id,
        "topic_id": topic_id
    })

    if existing_progress:

        db.progress.update_one(
            {
                "_id": existing_progress["_id"]
            },
            {
                "$set": {
                    "completed": data.completed,
                    "progress_percentage": data.progress_percentage,
                    "updated_at": now
                }
            }
        )

        return {
            "message": "Progress updated successfully",
            "progress_id": str(existing_progress["_id"]),
            "topic_id": data.topic_id,
            "completed": data.completed,
            "progress_percentage": data.progress_percentage
        }

    # Create new progress
    progress = {
        "user_id": user_id,
        "topic_id": topic_id,
        "completed": data.completed,
        "progress_percentage": data.progress_percentage,
        "created_at": now,
        "updated_at": now
    }

    result = db.progress.insert_one(progress)

    return {
        "message": "Progress created successfully",
        "progress_id": str(result.inserted_id),
        "topic_id": data.topic_id,
        "completed": data.completed,
        "progress_percentage": data.progress_percentage
    }


# =========================================================
# GET ALL MY PROGRESS
# =========================================================

@router.get("")
def get_my_progress(
    current_user=Depends(get_current_user)
):

    user_id = ObjectId(current_user["_id"])

    progress_list = list(
        db.progress.find({
            "user_id": user_id
        })
    )

    return [
        {
            "id": str(progress["_id"]),
            "topic_id": str(progress["topic_id"]),
            "completed": progress.get("completed", False),
            "progress_percentage": progress.get(
                "progress_percentage",
                0
            ),
            "created_at": progress.get("created_at"),
            "updated_at": progress.get("updated_at")
        }
        for progress in progress_list
    ]


# =========================================================
# GET PROGRESS FOR ONE TOPIC
# =========================================================

@router.get("/topic/{topic_id}")
def get_topic_progress(
    topic_id: str,
    current_user=Depends(get_current_user)
):

    try:
        topic_object_id = ObjectId(topic_id)
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid topic ID"
        )

    user_id = ObjectId(current_user["_id"])

    progress = db.progress.find_one({
        "user_id": user_id,
        "topic_id": topic_object_id
    })

    if not progress:
        return {
            "topic_id": topic_id,
            "completed": False,
            "progress_percentage": 0
        }

    return {
        "id": str(progress["_id"]),
        "topic_id": str(progress["topic_id"]),
        "completed": progress.get("completed", False),
        "progress_percentage": progress.get(
            "progress_percentage",
            0
        ),
        "created_at": progress.get("created_at"),
        "updated_at": progress.get("updated_at")
    }


# =========================================================
# GET COURSE PROGRESS
# =========================================================

@router.get("/course/{course_id}")
def get_course_progress(
    course_id: str,
    current_user=Depends(get_current_user)
):

    # Validate course ID
    try:
        course_object_id = ObjectId(course_id)
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid course ID"
        )

    # Check course
    course = db.courses.find_one({
        "_id": course_object_id,
        "is_published": True
    })

    if not course:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Course not found"
        )

    user_id = ObjectId(current_user["_id"])

    # Get published modules
    modules = list(
        db.modules.find({
            "course_id": course_object_id,
            "is_published": True
        })
    )

    module_ids = [
        module["_id"]
        for module in modules
    ]

    # Get published topics
    if module_ids:
        topics = list(
            db.topics.find({
                "module_id": {
                    "$in": module_ids
                },
                "is_published": True
            })
        )
    else:
        topics = []

    total_topics = len(topics)

    if total_topics == 0:
        return {
            "course_id": course_id,
            "course_title": course["title"],
            "total_topics": 0,
            "completed_topics": 0,
            "progress_percentage": 0
        }

    topic_ids = [
        topic["_id"]
        for topic in topics
    ]

    # Get user's progress for these topics
    progress_records = list(
        db.progress.find({
            "user_id": user_id,
            "topic_id": {
                "$in": topic_ids
            }
        })
    )

    completed_topics = sum(
        1
        for progress in progress_records
        if progress.get("completed", False)
    )

    # Calculate average progress
    total_progress = sum(
        progress.get("progress_percentage", 0)
        for progress in progress_records
    )

    progress_percentage = round(
        total_progress / total_topics,
        2
    )

    return {
        "course_id": course_id,
        "course_title": course["title"],
        "total_topics": total_topics,
        "completed_topics": completed_topics,
        "progress_percentage": progress_percentage
    }


# =========================================================
# GET ONE PROGRESS RECORD
# =========================================================

@router.get("/{progress_id}")
def get_progress(
    progress_id: str,
    current_user=Depends(get_current_user)
):

    try:
        object_id = ObjectId(progress_id)
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid progress ID"
        )

    user_id = ObjectId(current_user["_id"])

    progress = db.progress.find_one({
        "_id": object_id,
        "user_id": user_id
    })

    if not progress:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Progress not found"
        )

    return {
        "id": str(progress["_id"]),
        "topic_id": str(progress["topic_id"]),
        "completed": progress.get("completed", False),
        "progress_percentage": progress.get(
            "progress_percentage",
            0
        ),
        "created_at": progress.get("created_at"),
        "updated_at": progress.get("updated_at")
    }


# =========================================================
# UPDATE PROGRESS
# =========================================================

@router.put("/{progress_id}")
def update_progress(
    progress_id: str,
    data: ProgressUpdate,
    current_user=Depends(get_current_user)
):

    try:
        progress_object_id = ObjectId(progress_id)
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid progress ID"
        )

    try:
        topic_object_id = ObjectId(data.topic_id)
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid topic ID"
        )

    user_id = ObjectId(current_user["_id"])

    # Check topic
    topic = db.topics.find_one({
        "_id": topic_object_id,
        "is_published": True
    })

    if not topic:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Topic not found"
        )

    result = db.progress.update_one(
        {
            "_id": progress_object_id,
            "user_id": user_id
        },
        {
            "$set": {
                "topic_id": topic_object_id,
                "completed": data.completed,
                "progress_percentage": data.progress_percentage,
                "updated_at": datetime.now(timezone.utc)
            }
        }
    )

    if result.matched_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Progress not found"
        )

    return {
        "message": "Progress updated successfully",
        "progress_id": progress_id,
        "topic_id": data.topic_id,
        "completed": data.completed,
        "progress_percentage": data.progress_percentage
    }


# =========================================================
# DELETE PROGRESS
# =========================================================

@router.delete("/{progress_id}")
def delete_progress(
    progress_id: str,
    current_user=Depends(get_current_user)
):

    try:
        object_id = ObjectId(progress_id)
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid progress ID"
        )

    user_id = ObjectId(current_user["_id"])

    result = db.progress.delete_one({
        "_id": object_id,
        "user_id": user_id
    })

    if result.deleted_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Progress not found"
        )

    return {
        "message": "Progress deleted successfully",
        "progress_id": progress_id
    }