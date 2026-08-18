from pydantic import BaseModel, Field, HttpUrl


class TopicCreate(BaseModel):

    module_id: str

    title: str = Field(
        ...,
        min_length=2,
        max_length=150
    )

    description: str = Field(
        ...,
        min_length=5,
        max_length=500
    )

    youtube_url: HttpUrl

    order: int = Field(
        ...,
        ge=1
    )