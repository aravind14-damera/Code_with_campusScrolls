from pydantic import BaseModel, Field


class ProgressUpdate(BaseModel):

    topic_id: str

    completed: bool = False

    progress_percentage: int = Field(
        default=0,
        ge=0,
        le=100
    )