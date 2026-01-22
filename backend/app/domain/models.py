"""Core domain models"""
from dataclasses import dataclass, field
from datetime import datetime, timezone


def utc_now() -> datetime:
    """Get current UTC datetime"""
    return datetime.now(timezone.utc)


@dataclass
class Profile:
    """User profile domain model"""
    device_id: str
    my_clicks: int = 0
    unlocked_cosmetics: list[str] = field(default_factory=lambda: ["default"])
    selected_cosmetic: str = "default"
    created_at: datetime = field(default_factory=utc_now)
    updated_at: datetime = field(default_factory=utc_now)
    schema_version: int = 1


@dataclass
class GlobalState:
    """Global state domain model"""
    global_clicks: int = 0
    updated_at: datetime = field(default_factory=utc_now)
    schema_version: int = 1