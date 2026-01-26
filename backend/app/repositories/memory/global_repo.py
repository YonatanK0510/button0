"""Thread-safe in-memory global state repository"""
import threading

from app.domain.models import GlobalState, utc_now
from app.repositories.interfaces import GlobalStateRepository


class InMemoryGlobalStateRepository(GlobalStateRepository):
    """In-memory GlobalState repository (thread-safe singleton)"""

    def __init__(self):
        self._lock = threading.RLock()
        self._state: GlobalState | None = None

    def get_state(self) -> GlobalState:
        with self._lock:
            if self._state is None:
                self._state = GlobalState(global_clicks=0, updated_at=utc_now())
            return self._state

    def increment_clicks(self, delta: int) -> GlobalState:
        with self._lock:
            if self._state is None:
                self._state = GlobalState(global_clicks=0, updated_at=utc_now())
            self._state.global_clicks += delta
            self._state.updated_at = utc_now()
            return self._state