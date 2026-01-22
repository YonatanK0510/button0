"""Profile service - business logic for profiles"""
from app.domain.models import Profile
from app.repositories.interfaces import ProfileRepository


class ProfileService:
    """Service for profile operations"""
    
    def __init__(self, profile_repo: ProfileRepository):
        self.profile_repo = profile_repo
    
    def get_or_create_profile(self, device_id: str) -> Profile:
        """
        Get existing profile or create a new one with defaults.
        Creates profile with: my_clicks=0, unlocked_cosmetics=["default"], 
        selected_cosmetic="default"
        """
        profile = self.profile_repo.get_by_device_id(device_id)
        
        if profile is None:
            profile = Profile(
                device_id=device_id,
                my_clicks=0,
                unlocked_cosmetics=["default"],
                selected_cosmetic="default"
            )
            profile = self.profile_repo.create(profile)
        
        return profile