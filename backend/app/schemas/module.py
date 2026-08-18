from pydantic import BaseModel, Field


class ModuleCreate(BaseModel):

    course_id: str

    title: str = Field(
        ...,
        min_length=2,
        max_length=100
    )

    description: str = Field(
        ...,
        min_length=5,
        max_length=500
    )

    order: int = Field(
        ...,
        ge=1
    )