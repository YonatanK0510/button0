"""Click-related schemas"""
from datetime import datetime
from pydantic import BaseModel, Field, field_validator


class ClickIncrementRequest(BaseModel):
    """Request to increment clicks"""
    device_id: str
    delta: int = Field(default=1, ge=1, le=10)
    
    @field_validator("delta")
    @classmethod
    def validate_delta(cls, v: int) -> int:
        """Ensure delta is within valid range"""
        if not (1 <= v <= 10):
            raise ValueError("delta must be between 1 and 10")
        return v


class ClickIncrementResponse(BaseModel):
    """Response after incrementing clicks"""
    device_id: str
    my_clicks: int
    global_clicks: int
    selected_cosmetic: str
    unlocked_cosmetics: list[str]
    occurred_at: datetime
    schema_version: int = Field(default=1)