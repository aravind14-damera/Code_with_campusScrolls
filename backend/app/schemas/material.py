from pydantic import BaseModel, Field


class MaterialResponse(BaseModel):

    id: str

    topic_id: str

    title: str = Field(
        ...,
        min_length=2,
        max_length=150
    )

    file_url: str

    public_id: str