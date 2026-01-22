"""Profile endpoints"""
from typing import Annotated

from fastapi import APIRouter, Depends

from app.deps import get_profile_service
from app.schemas.profile import ProfileResponse
from app.services.profile_service import ProfileService

router = APIRouter()


@router.get("/{device_id}", response_model=ProfileResponse)
def get_profile(
    device_id: str,
    profile_service: Annotated[ProfileService, Depends(get_profile_service)],
) -> ProfileResponse:
    """
    Get or create a profile for a device.
    Creates profile with defaults if it doesn't exist.
    """
    profile = profile_service.get_or_create_profile(device_id)
    return ProfileResponse(
        device_id=profile.device_id,
        my_clicks=profile.my_clicks,
        unlocked_cosmetics=profile.unlocked_cosmetics,
        selected_cosmetic=profile.selected_cosmetic,
        created_at=profile.created_at,
        updated_at=profile.updated_at,
        schema_version=profile.schema_version,
    )
