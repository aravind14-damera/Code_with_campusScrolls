from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import client

from app.routes.auth import router as auth_router
from app.routes.courses import router as courses_router
from app.routes.modules import router as modules_router
from app.routes.topics import router as topics_router
from app.routes.materials import router as materials_router
from app.routes.problems import router as problems_router
from app.routes.progress import router as progress_router
from app.routes.learning import router as learning_router
from app.routes.enrollments import router as enrollments_router
from app.routes.dashboard import router as dashboard_router


# =========================================================
# CREATE FASTAPI APP
# =========================================================

app = FastAPI(
    title="Java Learning Platform API",
    description="Backend API for the Java learning platform",
    version="1.0.0"
)


# =========================================================
# CORS
# =========================================================

app.add_middleware(
    CORSMiddleware,

    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],

    allow_credentials=True,

    allow_methods=["*"],

    allow_headers=["*"],
)


# =========================================================
# ROUTES
# =========================================================

app.include_router(auth_router)
app.include_router(courses_router)
app.include_router(modules_router)
app.include_router(topics_router)
app.include_router(materials_router)
app.include_router(problems_router)
app.include_router(progress_router)
app.include_router(learning_router)
app.include_router(enrollments_router)
app.include_router(dashboard_router)


# =========================================================
# ROOT
# =========================================================

@app.get("/")
def root():
    return {
        "message": "Java Learning Platform API is running 🚀"
    }


# =========================================================
# HEALTH CHECK
# =========================================================

@app.get("/health")
def health_check():

    try:

        client.admin.command("ping")

        return {
            "status": "healthy",
            "database": "connected"
        }

    except Exception as e:

        return {
            "status": "unhealthy",
            "database": "disconnected",
            "error": str(e)
        }