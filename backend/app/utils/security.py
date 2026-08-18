import os

import jwt
from bson import ObjectId
from dotenv import load_dotenv
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.database import db


load_dotenv()


# =========================================================
# JWT CONFIGURATION
# =========================================================

JWT_SECRET = os.getenv("JWT_SECRET_KEY")

JWT_ALGORITHM = os.getenv(
    "JWT_ALGORITHM",
    "HS256"
)


if not JWT_SECRET:
    raise ValueError(
        "JWT_SECRET_KEY is not set"
    )


# =========================================================
# BEARER AUTHENTICATION
# =========================================================

security = HTTPBearer()


# =========================================================
# GET CURRENT USER
# =========================================================

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(
        security
    )
):

    token = credentials.credentials

    try:

        payload = jwt.decode(
            token,
            JWT_SECRET,
            algorithms=[JWT_ALGORITHM]
        )

        user_id = payload.get("sub")

        if not user_id:

            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token"
            )

    except jwt.ExpiredSignatureError:

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired"
        )

    except jwt.InvalidTokenError:

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )

    # -----------------------------------------------------
    # Validate MongoDB ObjectId
    # -----------------------------------------------------

    try:

        object_id = ObjectId(user_id)

    except Exception:

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid user ID"
        )

    # -----------------------------------------------------
    # Find user
    # -----------------------------------------------------

    user = db.users.find_one({
        "_id": object_id
    })

    if not user:

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found"
        )

    return user


# =========================================================
# GET CURRENT ADMIN
# =========================================================

def get_current_admin(
    current_user=Depends(get_current_user)
):

    role = current_user.get(
        "role",
        "student"
    )

    if role != "admin":

        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )

    return current_user