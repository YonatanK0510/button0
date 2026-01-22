"""Cosmetic-related schemas"""
from datetime import datetime
from pydantic import BaseModel, Field


class CosmeticSelectRequest(BaseModel):
    """Request to select a cosmetic"""
    device_id: str
    selected_cosmetic: str


class CosmeticSelectResponse(BaseModel):
    """Response after selecting cosmetic"""
    device_id: str
    selected_cosmetic: str
    updated_at: datetime
    schema_version: int = Field(default=1)


class CosmeticUnlockRequest(BaseModel):
    """Request to unlock a cosmetic"""
    device_id: str
    cosmetic_id: str


class CosmeticUnlockResponse(BaseModel):
    """Response after unlocking cosmetic"""
    device_id: str
    unlocked_cosmetics: list[str]
    updated_at: datetime
    schema_version: int = Field(default=1)