"""Dependency injection for FastAPI endpoints"""
from typing import Annotated

from fastapi import Depends

from app.repositories.interfaces import ProfileRepository, GlobalStateRepository
from app.repositories.memory.profile_repo import InMemoryProfileRepository
from app.repositories.memory.global_repo import InMemoryGlobalStateRepository
from app.services.profile_service import ProfileService
from app.services.click_service import ClickService
from app.services.cosmetic_service import CosmeticService

# Singleton repository instances
_profile_repo = InMemoryProfileRepository()
_global_repo = InMemoryGlobalStateRepository()


def get_profile_repository() -> ProfileRepository:
    """Provide profile repository instance"""
    return _profile_repo


def get_global_repository() -> GlobalStateRepository:
    """Provide global state repository instance"""
    return _global_repo


def get_profile_service(
    profile_repo: Annotated[ProfileRepository, Depends(get_profile_repository)]
) -> ProfileService:
    """Provide profile service instance"""
    return ProfileService(profile_repo)


def get_click_service(
    profile_repo: Annotated[ProfileRepository, Depends(get_profile_repository)],
    global_repo: Annotated[GlobalStateRepository, Depends(get_global_repository)]
) -> ClickService:
    """Provide click service instance"""
    return ClickService(profile_repo, global_repo)


def get_cosmetic_service(
    profile_repo: Annotated[ProfileRepository, Depends(get_profile_repository)]
) -> CosmeticService:
    """Provide cosmetic service instance"""
    return CosmeticService(profile_repo)