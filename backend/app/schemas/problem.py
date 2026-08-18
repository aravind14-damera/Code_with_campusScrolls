from typing import List

from pydantic import BaseModel, Field


class ProblemExample(BaseModel):

    input: str

    output: str

    explanation: str | None = None


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

    examples: List[ProblemExample] = []

    constraints: List[str] = []

    starter_code: str = ""

    order: int = Field(
        ...,
        ge=1
    )