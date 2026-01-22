"""Cosmetic endpoints"""
from typing import Annotated

from fastapi import APIRouter, Depends

from app.deps import get_cosmetic_service
from app.services.cosmetic_service import CosmeticService
from app.schemas.cosmetic import (
    CosmeticSelectRequest,
    CosmeticSelectResponse,
    CosmeticUnlockRequest,
    CosmeticUnlockResponse
)

router = APIRouter()


@router.put("/selected", response_model=CosmeticSelectResponse)
async def select_cosmetic(
    request: CosmeticSelectRequest,
    cosmetic_service: Annotated[CosmeticService, Depends(get_cosmetic_service)]
):
    """
    Select a cosmetic for a user.
    
    Validates that the cosmetic is in the user's unlocked_cosmetics list.
    Returns 400 if cosmetic is not unlocked.
    """
    profile = cosmetic_service.select_cosmetic(
        request.device_id,
        request.selected_cosmetic
    )
    
    return CosmeticSelectResponse(
        device_id=profile.device_id,
        selected_cosmetic=profile.selected_cosmetic,
        updated_at=profile.updated_at,
        schema_version=profile.schema_version
    )


@router.post("/unlock", response_model=CosmeticUnlockResponse)
async def unlock_cosmetic(
    request: CosmeticUnlockRequest,
    cosmetic_service: Annotated[CosmeticService, Depends(get_cosmetic_service)]
):
    """
    Unlock a cosmetic for a user.
    
    Idempotent - does not add duplicates to unlocked_cosmetics list.
    """
    profile = cosmetic_service.unlock_cosmetic(
        request.device_id,
        request.cosmetic_id
    )
    
    return CosmeticUnlockResponse(
        device_id=profile.device_id,
        unlocked_cosmetics=profile.unlocked_cosmetics,
        updated_at=profile.updated_at,
        schema_version=profile.schema_version
    )