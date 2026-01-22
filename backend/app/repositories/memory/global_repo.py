"""In-memory global state repository implementation"""
from threading import Lock

from app.domain.models import GlobalState, utc_now


class InMemoryGlobalStateRepository:
    """Thread-safe in-memory global state storage"""
    
    def __init__(self):
        self._state = GlobalState()
        self._lock = Lock()
    
    def get_state(self) -> GlobalState:
        """Get current global state"""
        with self._lock:
            return GlobalState(
                global_clicks=self._state.global_clicks,
                updated_at=self._state.updated_at,
                schema_version=self._state.schema_version
            )
    
    def increment_clicks(self, delta: int) -> GlobalState:
        """Increment global clicks by delta"""
        with self._lock:
            self._state.global_clicks += delta
            self._state.updated_at = utc_now()
            return GlobalState(
                global_clicks=self._state.global_clicks,
                updated_at=self._state.updated_at,
                schema_version=self._state.schema_version
            )