from fastapi import APIRouter, Depends

from app.deps import get_click_service
from app.schemas.global_state import GlobalStateResponse
from app.services.click_service import ClickService

router = APIRouter()

@router.get("/global", response_model=GlobalStateResponse)
def get_global_state(click_service: ClickService = Depends(get_click_service)) -> GlobalStateResponse:
    return click_service.get_global_state()
