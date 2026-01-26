"""Thread-safe in-memory profile repository"""
import threading
from typing import Optional

from app.domain.models import Profile, utc_now
from app.repositories.interfaces import ProfileRepository


class InMemoryProfileRepository(ProfileRepository):
    """In-memory Profile repository (thread-safe)"""

    def __init__(self):
        self._lock = threading.RLock()
        self._profiles: dict[str, Profile] = {}

    def get_by_device_id(self, device_id: str) -> Optional[Profile]:
        with self._lock:
            profile = self._profiles.get(device_id)
            if not profile:
                return None
            # ensure defaults
            if not profile.unlocked_cosmetics:
                profile.unlocked_cosmetics = ["default"]
            if not profile.selected_cosmetic:
                profile.selected_cosmetic = "default"
            return profile

    def create(self, profile: Profile) -> Profile:
        with self._lock:
            if not profile.unlocked_cosmetics:
                profile.unlocked_cosmetics = ["default"]
            if not profile.selected_cosmetic:
                profile.selected_cosmetic = "default"
            self._profiles[profile.device_id] = profile
            return profile

    def update(self, profile: Profile) -> Profile:
        with self._lock:
            if profile.device_id not in self._profiles:
                raise ValueError(f"Profile {profile.device_id} not found")
            if not profile.unlocked_cosmetics:
                profile.unlocked_cosmetics = ["default"]
            if not profile.selected_cosmetic:
                profile.selected_cosmetic = "default"
            profile.updated_at = utc_now()
            self._profiles[profile.device_id] = profile
            return profile