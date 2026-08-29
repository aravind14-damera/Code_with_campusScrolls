from datetime import datetime, timezone

from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException, status

from app.database import db
from app.schemas.topic import TopicCreate
from app.utils.security import get_current_admin


router = APIRouter(
    prefix="/topics",
    tags=["Topics"]
)


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

    # -----------------------------------------------------
    # Validate module ID
    # -----------------------------------------------------

    try:
        module_id = ObjectId(data.module_id)

    except Exception:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid module ID"
        )

    # -----------------------------------------------------
    # Check module
    # -----------------------------------------------------

    module = db.modules.find_one({
        "_id": module_id,
        "is_published": True
    })

    if not module:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Module not found"
        )

    # -----------------------------------------------------
    # Create topic
    # -----------------------------------------------------

    now = datetime.now(timezone.utc)

    topic = {
        "module_id": module_id,
        "title": data.title.strip(),
        "description": data.description.strip(),
        "youtube_url": str(data.youtube_url),
        "order": data.order,
        "is_published": True,
        "created_at": now,
        "updated_at": now
    }

    result = db.topics.insert_one(topic)

    return {
        "message": "Topic created successfully",
        "topic_id": str(result.inserted_id),
        "module_id": data.module_id,
        "title": data.title,
        "description": data.description,
        "youtube_url": str(data.youtube_url),
        "order": data.order
    }


# =========================================================
# GET ALL TOPICS FOR A MODULE - PUBLIC
# =========================================================

@router.get("/module/{module_id}")
def get_module_topics(module_id: str):

    # -----------------------------------------------------
    # Validate module ID
    # -----------------------------------------------------

    try:
        object_id = ObjectId(module_id)

    except Exception:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid module ID"
        )

    # -----------------------------------------------------
    # Check module
    # -----------------------------------------------------

    module = db.modules.find_one({
        "_id": object_id,
        "is_published": True
    })

    if not module:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Module not found"
        )

    # -----------------------------------------------------
    # Get topics
    # -----------------------------------------------------

    topics = list(
        db.topics.find({
            "module_id": object_id,
            "is_published": True
        }).sort("order", 1)
    )

    return [
        {
            "id": str(topic["_id"]),
            "module_id": str(topic["module_id"]),
            "title": topic["title"],
            "description": topic["description"],
            "youtube_url": topic["youtube_url"],
            "order": topic["order"],
            "is_published": topic["is_published"]
        }
        for topic in topics
    ]


# =========================================================
# GET ONE TOPIC - PUBLIC
# =========================================================

@router.get("/{topic_id}")
def get_topic(topic_id: str):

    # -----------------------------------------------------
    # Validate topic ID
    # -----------------------------------------------------

    try:
        object_id = ObjectId(topic_id)

    except Exception:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid topic ID"
        )

    # -----------------------------------------------------
    # Find topic
    # -----------------------------------------------------

    topic = db.topics.find_one({
        "_id": object_id,
        "is_published": True
    })

    if not topic:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Topic not found"
        )

    return {
        "id": str(topic["_id"]),
        "module_id": str(topic["module_id"]),
        "title": topic["title"],
        "description": topic["description"],
        "youtube_url": topic["youtube_url"],
        "order": topic["order"],
        "is_published": topic["is_published"]
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

    # -----------------------------------------------------
    # Validate topic ID
    # -----------------------------------------------------

    try:
        object_id = ObjectId(topic_id)

    except Exception:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid topic ID"
        )

    # -----------------------------------------------------
    # Validate module ID
    # -----------------------------------------------------

    try:
        module_id = ObjectId(data.module_id)

    except Exception:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid module ID"
        )

    # -----------------------------------------------------
    # Check module
    # -----------------------------------------------------

    module = db.modules.find_one({
        "_id": module_id,
        "is_published": True
    })

    if not module:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Module not found"
        )

    # -----------------------------------------------------
    # Check topic
    # -----------------------------------------------------

    existing_topic = db.topics.find_one({
        "_id": object_id
    })

    if not existing_topic:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Topic not found"
        )

    # -----------------------------------------------------
    # Update topic
    # -----------------------------------------------------

    now = datetime.now(timezone.utc)

    result = db.topics.update_one(
        {
            "_id": object_id
        },
        {
            "$set": {
                "module_id": module_id,
                "title": data.title.strip(),
                "description": data.description.strip(),
                "youtube_url": str(data.youtube_url),
                "order": data.order,
                "updated_at": now
            }
        }
    )

    if result.matched_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Topic not found"
        )

    return {
        "message": "Topic updated successfully",
        "topic_id": topic_id,
        "module_id": data.module_id,
        "title": data.title,
        "description": data.description,
        "youtube_url": str(data.youtube_url),
        "order": data.order
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

    # -----------------------------------------------------
    # Validate topic ID
    # -----------------------------------------------------

    try:
        object_id = ObjectId(topic_id)

    except Exception:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid topic ID"
        )

    # -----------------------------------------------------
    # Check topic exists
    # -----------------------------------------------------

    topic = db.topics.find_one({
        "_id": object_id
    })

    if not topic:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Topic not found"
        )

    # -----------------------------------------------------
    # PERMANENT DELETE
    # -----------------------------------------------------

    result = db.topics.delete_one({
        "_id": object_id
    })

    if result.deleted_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Topic not found"
        )

    # -----------------------------------------------------
    # Response
    # -----------------------------------------------------

    return {
        "message": "Topic permanently deleted",
        "topic_id": topic_id
    }