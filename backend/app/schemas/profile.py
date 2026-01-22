"""Profile-related schemas"""
from datetime import datetime
from pydantic import BaseModel, Field


class ProfileResponse(BaseModel):
    """Profile response schema"""
    device_id: str
    my_clicks: int
    unlocked_cosmetics: list[str]
    selected_cosmetic: str
    created_at: datetime
    updated_at: datetime
    schema_version: int = Field(default=1)
    
    class Config:
        from_attributes = True