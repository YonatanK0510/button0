"""Repository interfaces using Protocol for type safety"""
from typing import Protocol, Optional

from app.domain.models import Profile, GlobalState


class ProfileRepository(Protocol):
    """Interface for profile data access"""
    
    def get_by_device_id(self, device_id: str) -> Optional[Profile]:
        """Get profile by device ID, returns None if not found"""
        ...
    
    def create(self, profile: Profile) -> Profile:
        """Create a new profile"""
        ...
    
    def update(self, profile: Profile) -> Profile:
        """Update an existing profile"""
        ...


class GlobalStateRepository(Protocol):
    """Interface for global state data access"""
    
    def get_state(self) -> GlobalState:
        """Get global state"""
        ...
    
    def increment_clicks(self, delta: int) -> GlobalState:
        """Increment global clicks by delta"""
        ...