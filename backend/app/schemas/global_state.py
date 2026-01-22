"""Global state schemas"""
from datetime import datetime
from pydantic import BaseModel, Field


class GlobalStateResponse(BaseModel):
    """Global state response schema"""
    global_clicks: int
    updated_at: datetime
    schema_version: int = Field(default=1)
    
    class Config:
        from_attributes = True