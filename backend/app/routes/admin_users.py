from fastapi import APIRouter, Depends, HTTPException, status

from app.database import db
from app.utils.security import get_current_user


router = APIRouter(
    prefix="/admin/users",
    tags=["Admin Users"]
)


# =========================================================
# GET ALL USERS
# ADMIN ONLY
# =========================================================

@router.get("")
def get_all_users(
    current_user=Depends(get_current_user)
):

    # =====================================================
    # ADMIN CHECK
    # =====================================================

    role = str(
        current_user.get("role", "")
    ).lower()

    if role != "admin":

        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )


    # =====================================================
    # GET USERS
    # =====================================================

    users = list(
        db.users.find(
            {},
            {
                "password": 0
            }
        ).sort(
            "_id",
            -1
        )
    )


    # =====================================================
    # FORMAT RESPONSE
    # =====================================================

    result = []

    for user in users:

        user_role = user.get(
            "role",
            "student"
        )

        result.append({

            "id": str(
                user["_id"]
            ),

            "name": user.get(
                "name",
                "Unknown User"
            ),

            "email": user.get(
                "email",
                ""
            ),

            "role": str(
                user_role
            ).capitalize(),

            "status": (
                "Active"
                if user.get(
                    "is_active",
                    True
                )
                else "Inactive"
            )
        })


    return result