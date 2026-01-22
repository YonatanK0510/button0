"""Cosmetic service - business logic for cosmetic operations"""
from fastapi import HTTPException

from app.domain.models import Profile, utc_now
from app.repositories.interfaces import ProfileRepository


class CosmeticService:
    """Service for cosmetic operations"""
    
    def __init__(self, profile_repo: ProfileRepository):
        self.profile_repo = profile_repo
    
    def select_cosmetic(self, device_id: str, cosmetic_id: str) -> Profile:
        """
        Select a cosmetic for a user.
        Validates that the cosmetic is unlocked.
        """
        profile = self.profile_repo.get_by_device_id(device_id)
        
        if profile is None:
            raise HTTPException(status_code=404, detail="Profile not found")
        
        if cosmetic_id not in profile.unlocked_cosmetics:
            raise HTTPException(
                status_code=400,
                detail=f"Cosmetic '{cosmetic_id}' is not unlocked"
            )
        
        profile.selected_cosmetic = cosmetic_id
        profile.updated_at = utc_now()
        return self.profile_repo.update(profile)
    
    def unlock_cosmetic(self, device_id: str, cosmetic_id: str) -> Profile:
        """
        Unlock a cosmetic for a user.
        Idempotent - does not add duplicates.
        """
        profile = self.profile_repo.get_by_device_id(device_id)
        
        if profile is None:
            raise HTTPException(status_code=404, detail="Profile not found")
        
        # Idempotent: only add if not already unlocked
        if cosmetic_id not in profile.unlocked_cosmetics:
            profile.unlocked_cosmetics.append(cosmetic_id)
            profile.updated_at = utc_now()
            profile = self.profile_repo.update(profile)
        
        return profile