from pydantic import BaseModel, Field


class CourseCreate(BaseModel):

    title: str = Field(
        ...,
        min_length=2,
        max_length=100
    )

    description: str = Field(
        ...,
        min_length=10,
        max_length=500
    )