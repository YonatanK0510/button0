"""Health check endpoints"""
from fastapi import APIRouter

router = APIRouter()


@router.get("/live")
async def liveness():
    """Liveness probe - is the service running?"""
    return {"status": "ok"}


@router.get("/ready")
async def readiness():
    """Readiness probe - is the service ready to accept traffic?"""
    return {"status": "ok"}