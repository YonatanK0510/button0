"""Click service - business logic for click operations"""
from app.domain.models import Profile, GlobalState, utc_now
from app.repositories.interfaces import ProfileRepository, GlobalStateRepository
from app.schemas.global_state import GlobalStateResponse


class ClickService:
    """Service for click operations"""
    
    def __init__(
        self,
        profile_repo: ProfileRepository,
        global_repo: GlobalStateRepository
    ):
        self.profile_repo = profile_repo
        self.global_repo = global_repo
    
    def increment_clicks(self, device_id: str, delta: int) -> tuple[Profile, GlobalState]:
        """
        Increment clicks for a user and globally.
        Returns updated profile and global state.
        """
        # Get or create profile
        profile = self.profile_repo.get_by_device_id(device_id)
        if profile is None:
            profile = Profile(
                device_id=device_id,
                my_clicks=0,
                unlocked_cosmetics=["default"],
                selected_cosmetic="default"
            )
            profile = self.profile_repo.create(profile)
        
        # Increment user clicks
        profile.my_clicks += delta
        profile.updated_at = utc_now()
        profile = self.profile_repo.update(profile)
        
        # Increment global clicks
        global_state = self.global_repo.increment_clicks(delta)
        
        return profile, global_state

    def get_global_state(self) -> GlobalStateResponse:
        """Return current global click state"""
        state = self.global_repo.get_state()
        return GlobalStateResponse(
            global_clicks=state.global_clicks,
            updated_at=state.updated_at,
            schema_version=state.schema_version,
        )