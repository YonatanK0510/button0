"""In-memory profile repository implementation"""
from threading import Lock
from typing import Optional

from app.domain.models import Profile


class InMemoryProfileRepository:
    """Thread-safe in-memory profile storage"""
    
    def __init__(self):
        self._profiles: dict[str, Profile] = {}
        self._lock = Lock()
    
    def get_by_device_id(self, device_id: str) -> Optional[Profile]:
        """Get profile by device ID"""
        with self._lock:
            return self._profiles.get(device_id)
    
    def create(self, profile: Profile) -> Profile:
        """Create a new profile"""
        with self._lock:
            self._profiles[profile.device_id] = profile
            return profile
    
    def update(self, profile: Profile) -> Profile:
        """Update an existing profile"""
        with self._lock:
            self._profiles[profile.device_id] = profile
            return profile