"""Main API v1 router"""
from fastapi import APIRouter

from app.api.v1.endpoints.health import router as health_router
from app.api.v1.endpoints.profiles import router as profiles_router
from app.api.v1.endpoints.clicks import router as clicks_router
from app.api.v1.endpoints.cosmetics import router as cosmetics_router
from app.api.v1.endpoints.state import router as state_router

router = APIRouter()

router.include_router(health_router, prefix="/health", tags=["health"])
router.include_router(profiles_router, prefix="/profiles", tags=["profiles"])
router.include_router(clicks_router, prefix="/clicks", tags=["clicks"])
router.include_router(cosmetics_router, prefix="/cosmetics", tags=["cosmetics"])
router.include_router(state_router, prefix="/state", tags=["state"])

