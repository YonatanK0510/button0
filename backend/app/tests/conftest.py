"""Pytest configuration and fixtures"""
import pytest
from fastapi.testclient import TestClient

from app.main import app
from app.deps import (
    get_profile_repository,
    get_global_repository,
    get_profile_service,
    get_click_service,
    get_cosmetic_service,
)
from app.repositories.memory.profile_repo import InMemoryProfileRepository
from app.repositories.memory.global_repo import InMemoryGlobalStateRepository
from app.services.profile_service import ProfileService
from app.services.click_service import ClickService
from app.services.cosmetic_service import CosmeticService


@pytest.fixture
def client():
    # fresh repos per test
    profile_repo = InMemoryProfileRepository()
    global_repo = InMemoryGlobalStateRepository()

    # override providers to return these fresh instances
    app.dependency_overrides[get_profile_repository] = lambda: profile_repo
    app.dependency_overrides[get_global_repository] = lambda: global_repo
    app.dependency_overrides[get_profile_service] = (
        lambda: ProfileService(profile_repo)
    )
    app.dependency_overrides[get_click_service] = (
        lambda: ClickService(profile_repo, global_repo)
    )
    app.dependency_overrides[get_cosmetic_service] = (
        lambda: CosmeticService(profile_repo)
    )

    with TestClient(app) as c:
        yield c

    # clean overrides after each test
    app.dependency_overrides.clear()


@pytest.fixture
def test_device_id():
    """Test device ID"""
    return "test-device-12345"