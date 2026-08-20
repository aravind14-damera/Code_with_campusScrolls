import os
from datetime import datetime, timedelta, timezone

import jwt
from dotenv import load_dotenv
from fastapi import APIRouter, Depends, HTTPException, status
from pwdlib import PasswordHash

from app.database import db
from app.schemas.auth import LoginRequest, SignupRequest
from app.utils.security import get_current_user


load_dotenv()


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)

password_hash = PasswordHash.recommended()


# =========================================================
# JWT CONFIGURATION
# =========================================================

JWT_SECRET = os.getenv("JWT_SECRET_KEY")

JWT_ALGORITHM = os.getenv(
    "JWT_ALGORITHM",
    "HS256"
)

ACCESS_TOKEN_EXPIRE_MINUTES = int(
    os.getenv(
        "JWT_ACCESS_TOKEN_EXPIRE_MINUTES",
        "60"
    )
)


if not JWT_SECRET:
    raise ValueError(
        "JWT_SECRET_KEY is not set"
    )


# =========================================================
# CREATE JWT TOKEN
# =========================================================

def create_access_token(user_id: str) -> str:

    expire = (
        datetime.now(timezone.utc)
        + timedelta(
            minutes=ACCESS_TOKEN_EXPIRE_MINUTES
        )
    )

    payload = {
        "sub": user_id,
        "exp": expire
    }

    token = jwt.encode(
        payload,
        JWT_SECRET,
        algorithm=JWT_ALGORITHM
    )

    return token


# =========================================================
# SIGNUP
# =========================================================

@router.post(
    "/signup",
    status_code=status.HTTP_201_CREATED
)
def signup(data: SignupRequest):

    existing_user = db.users.find_one({
        "email": data.email
    })

    if existing_user:

        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already registered"
        )

    hashed_password = password_hash.hash(
        data.password
    )

    user = {
        "name": data.name,
        "email": data.email,
        "password_hash": hashed_password,
        "role": "student",
        "created_at": datetime.now(timezone.utc)
    }

    result = db.users.insert_one(user)

    return {
        "message": "Account created successfully",
        "user_id": str(result.inserted_id),
        "name": data.name,
        "email": data.email,
        "role": "student"
    }


# =========================================================
# LOGIN
# =========================================================

@router.post("/login")
def login(data: LoginRequest):

    user = db.users.find_one({
        "email": data.email
    })

    if not user:

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    password_valid = password_hash.verify(
        data.password,
        user["password_hash"]
    )

    if not password_valid:

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    role = user.get(
        "role",
        "student"
    )

    access_token = create_access_token(
        str(user["_id"])
    )

    return {
        "message": "Login successful",

        "access_token": access_token,

        "token_type": "bearer",

        "user": {
            "id": str(user["_id"]),
            "name": user["name"],
            "email": user["email"],
            "role": role
        }
    }


# =========================================================
# CURRENT USER
# =========================================================

@router.get("/me")
def get_me(
    current_user=Depends(get_current_user)
):

    return {
        "id": str(current_user["_id"]),
        "name": current_user["name"],
        "email": current_user["email"],
        "role": current_user.get(
            "role",
            "student"
        ),
        "created_at": current_user.get(
            "created_at"
        )
    }


# =========================================================
# DELETE MY ACCOUNT PERMANENTLY
# =========================================================

@router.delete("/me")
def delete_my_account(
    current_user=Depends(get_current_user)
):

    user_id = current_user["_id"]

    # -----------------------------------------------------
    # Delete user account
    # -----------------------------------------------------

    result = db.users.delete_one({
        "_id": user_id
    })

    if result.deleted_count == 0:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User account not found"
        )

    # -----------------------------------------------------
    # Delete related data
    # -----------------------------------------------------

    db.enrollments.delete_many({
        "user_id": user_id
    })

    db.progress.delete_many({
        "user_id": user_id
    })

    return {
        "message": "Account deleted permanently"
    }