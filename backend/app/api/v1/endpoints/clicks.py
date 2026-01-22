"""Click endpoints"""
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException

from app.deps import get_click_service
from app.services.click_service import ClickService
from app.schemas.click import ClickIncrementRequest, ClickIncrementResponse
from app.domain.models import utc_now

router = APIRouter()


@router.post("/increment", response_model=ClickIncrementResponse)
def increment_clicks(
    request: ClickIncrementRequest,
    click_service: Annotated[ClickService, Depends(get_click_service)],
) -> ClickIncrementResponse:
    """
    Increment clicks for a user and globally.
    
    Delta is validated to be in range 1..10 by Pydantic.
    Updates both per-user my_clicks and global_clicks.
    """
    try:
        profile, global_state = click_service.increment_clicks(
            request.device_id,
            request.delta
        )
        
        return ClickIncrementResponse(
            device_id=profile.device_id,
            my_clicks=profile.my_clicks,
            global_clicks=global_state.global_clicks,
            selected_cosmetic=profile.selected_cosmetic,
            unlocked_cosmetics=profile.unlocked_cosmetics,
            occurred_at=utc_now(),
            schema_version=1
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))