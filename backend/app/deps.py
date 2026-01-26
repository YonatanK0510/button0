"""Dependency injection for FastAPI endpoints"""
from typing import Annotated

from fastapi import Depends
from sqlalchemy.orm import Session

from app.config import settings
from app.database import get_db
from app.repositories.interfaces import ProfileRepository, GlobalStateRepository
from app.repositories.memory.profile_repo import InMemoryProfileRepository
from app.repositories.memory.global_repo import InMemoryGlobalStateRepository
from app.repositories.postgres.profile_repo import PostgresProfileRepository
from app.repositories.postgres.global_repo import PostgresGlobalStateRepository
from app.services.profile_service import ProfileService
from app.services.click_service import ClickService
from app.services.cosmetic_service import CosmeticService

# Singleton in-memory repository instances (only used when REPOSITORY_MODE=inmemory)
_profile_repo = InMemoryProfileRepository()
_global_repo = InMemoryGlobalStateRepository()


def get_db_session(db: Annotated[Session, Depends(get_db)]) -> Session:
    """Provide a DB session (request-scoped)."""
    return db


def get_profile_repository(
    db: Annotated[Session, Depends(get_db_session)],
) -> ProfileRepository:
    """Provide profile repository instance based on REPOSITORY_MODE setting"""
    if settings.repository_mode == "postgres":
        return PostgresProfileRepository(db)
    if settings.repository_mode == "inmemory":
        return _profile_repo
    raise ValueError(
        f"Invalid REPOSITORY_MODE: {settings.repository_mode}. "
        f"Must be 'inmemory' or 'postgres'"
    )


def get_global_repository(
    db: Annotated[Session, Depends(get_db_session)],
) -> GlobalStateRepository:
    """Provide global state repository instance based on REPOSITORY_MODE setting"""
    if settings.repository_mode == "postgres":
        return PostgresGlobalStateRepository(db)
    if settings.repository_mode == "inmemory":
        return _global_repo
    raise ValueError(
        f"Invalid REPOSITORY_MODE: {settings.repository_mode}. "
        f"Must be 'inmemory' or 'postgres'"
    )


def get_profile_service(
    profile_repo: Annotated[ProfileRepository, Depends(get_profile_repository)],
) -> ProfileService:
    """Provide profile service instance"""
    return ProfileService(profile_repo)


def get_click_service(
    profile_repo: Annotated[ProfileRepository, Depends(get_profile_repository)],
    global_repo: Annotated[GlobalStateRepository, Depends(get_global_repository)],
) -> ClickService:
    """Provide click service instance"""
    return ClickService(profile_repo, global_repo)


def get_cosmetic_service(
    profile_repo: Annotated[ProfileRepository, Depends(get_profile_repository)],
) -> CosmeticService:
    """Provide cosmetic service instance"""
    return CosmeticService(profile_repo)