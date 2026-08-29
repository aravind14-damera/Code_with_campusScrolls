from fastapi import APIRouter, Depends, HTTPException, status

from app.database import db
from app.utils.security import get_current_user


# =========================================================
# ROUTER
# =========================================================

router = APIRouter(
    prefix="/admin",
    tags=["Admin Dashboard"]
)


# =========================================================
# ADMIN CHECK
# =========================================================

def verify_admin(current_user):

    if current_user.get("role") != "admin":

        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )

    return current_user


# =========================================================
# ADMIN DASHBOARD
# =========================================================

@router.get("/dashboard")
def get_admin_dashboard(
    current_user=Depends(get_current_user)
):

    verify_admin(current_user)

    # Total users
    total_users = db.users.count_documents({})

    # Total courses
    total_courses = db.courses.count_documents({})

    # Total modules
    total_modules = db.modules.count_documents({})

    # Total topics
    total_topics = db.topics.count_documents({})

    return {
        "statistics": {
            "total_users": total_users,
            "total_courses": total_courses,
            "total_modules": total_modules,
            "total_topics": total_topics
        }
    }