from pydantic import BaseModel, Field


class ProblemCreate(BaseModel):

    topic_id: str

    title: str = Field(
        ...,
        min_length=2,
        max_length=200
    )

    description: str = Field(
        ...,
        min_length=10,
        max_length=5000
    )

    difficulty: str = Field(
        ...,
        pattern="^(Easy|Medium|Hard)$"
    )

    order: int = Field(
        ...,
        ge=1
    )


class ProblemResponse(BaseModel):

    id: str

    topic_id: str

    title: str

    description: str

    difficulty: str

    pdf_url: str | None = None

    pdf_public_id: str | None = None

    order: int

    is_published: bool