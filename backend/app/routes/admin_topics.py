from datetime import datetime, timezone

from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException, status

from app.database import db
from app.schemas.topic import TopicCreate
from app.utils.security import get_current_admin


router = APIRouter(
    prefix="/admin/topics",
    tags=["Admin Topics"]
)


# =========================================================
# GET ALL TOPICS - ADMIN DASHBOARD
# =========================================================

@router.get("")
def get_all_topics():

    topics = list(
        db.topics.find({}).sort("order", 1)
    )

    result = []

    for topic in topics:

        # Find the module that this topic belongs to
        module = db.modules.find_one({
            "_id": topic["module_id"]
        })

        result.append({
            "id": str(topic["_id"]),

            "module_id": str(
                topic["module_id"]
            ),

            "module": (
                module["title"]
                if module
                else "Unknown Module"
            ),

            "title": topic["title"],

            "description": topic.get(
                "description",
                ""
            ),

            "youtube_url": topic.get(
                "youtube_url",
                ""
            ),

            "order": topic.get(
                "order",
                1
            ),

            "is_published": topic.get(
                "is_published",
                False
            ),

            "status": (
                "Published"
                if topic.get(
                    "is_published",
                    False
                )
                else "Draft"
            )
        })

    return result


# =========================================================
# CREATE TOPIC - ADMIN ONLY
# =========================================================

@router.post(
    "",
    status_code=status.HTTP_201_CREATED
)
def create_topic(
    data: TopicCreate,
    current_admin=Depends(get_current_admin)
):

    # Validate module ID
    try:

        module_id = ObjectId(
            data.module_id
        )

    except Exception:

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid module ID"
        )

    # Check module
    module = db.modules.find_one({
        "_id": module_id,
        "is_published": True
    })

    if not module:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Module not found"
        )

    now = datetime.now(timezone.utc)

    topic = {
        "module_id": module_id,

        "title": data.title.strip(),

        "description": data.description.strip(),

        "youtube_url": str(
            data.youtube_url
        ),

        "order": data.order,

        "is_published": True,

        "created_at": now,

        "updated_at": now
    }

    result = db.topics.insert_one(topic)

    return {
        "message": "Topic created successfully",

        "topic_id": str(
            result.inserted_id
        )
    }


# =========================================================
# UPDATE TOPIC - ADMIN ONLY
# =========================================================

@router.put("/{topic_id}")
def update_topic(
    topic_id: str,
    data: TopicCreate,
    current_admin=Depends(get_current_admin)
):

    # Validate topic ID
    try:

        object_id = ObjectId(
            topic_id
        )

    except Exception:

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid topic ID"
        )

    # Validate module ID
    try:

        module_id = ObjectId(
            data.module_id
        )

    except Exception:

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid module ID"
        )

    # Check module
    module = db.modules.find_one({
        "_id": module_id,
        "is_published": True
    })

    if not module:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Module not found"
        )

    # Check topic
    topic = db.topics.find_one({
        "_id": object_id
    })

    if not topic:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Topic not found"
        )

    now = datetime.now(timezone.utc)

    db.topics.update_one(
        {
            "_id": object_id
        },
        {
            "$set": {

                "module_id": module_id,

                "title": data.title.strip(),

                "description": data.description.strip(),

                "youtube_url": str(
                    data.youtube_url
                ),

                "order": data.order,

                "updated_at": now
            }
        }
    )

    return {
        "message": "Topic updated successfully",

        "topic_id": topic_id
    }


# =========================================================
# DELETE TOPIC - ADMIN ONLY
# PERMANENT DELETE
# =========================================================

@router.delete("/{topic_id}")
def delete_topic(
    topic_id: str,
    current_admin=Depends(get_current_admin)
):

    # Validate topic ID
    try:

        object_id = ObjectId(
            topic_id
        )

    except Exception:

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid topic ID"
        )

    # Check topic
    topic = db.topics.find_one({
        "_id": object_id
    })

    if not topic:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Topic not found"
        )

    # Permanently delete
    result = db.topics.delete_one({
        "_id": object_id
    })

    if result.deleted_count == 0:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Topic not found"
        )

    return {
        "message": "Topic permanently deleted",

        "topic_id": topic_id
    }