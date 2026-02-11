"""Click endpoints"""
from datetime import datetime, timezone
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import update
from sqlalchemy.orm import Session

from app.config import settings
from app.deps import get_db_session
from app.domain.models import utc_now
from app.models import GlobalCounterORM, UserORM
from app.schemas.click import ClickIncrementRequest, ClickIncrementResponse

router = APIRouter()


@router.post("/increment", response_model=ClickIncrementResponse)
def increment_clicks(
    request: ClickIncrementRequest,
    db: Annotated[Session, Depends(get_db_session)],
) -> ClickIncrementResponse:
    """
    Increment clicks for a user and globally.
    
    Delta is validated to be in range 1..10 by Pydantic.
    Updates both per-user user.total_clicks and global_counter.total_clicks atomically within a single transaction.
    """
    if settings.repository_mode != "postgres":
        raise HTTPException(status_code=500, detail="repository_mode must be postgres")

    user_id = request.user_id
    delta = request.delta
    now = datetime.now(timezone.utc)

    user = db.get(UserORM, user_id)
    if user is None:
        user = UserORM(user_id=user_id, total_clicks=0, created_at=now, last_seen=now)
        db.add(user)
        db.flush()

    global_counter = db.get(GlobalCounterORM, 1)
    if global_counter is None:
        raise HTTPException(status_code=500, detail="Global counter not initialized")

    db.execute(
        update(UserORM)
        .where(UserORM.user_id == user_id)
        .values(total_clicks=UserORM.total_clicks + delta, last_seen=now)
    )

    db.execute(
        update(GlobalCounterORM)
        .where(GlobalCounterORM.id == 1)
        .values(total_clicks=GlobalCounterORM.total_clicks + delta)
    )

    db.flush()

    user = db.get(UserORM, user_id)
    global_counter = db.get(GlobalCounterORM, 1)

    # Cosmetics are not wired to users(user_id) yet.
    # Keep response stable for now; re-wire after profile/user consolidation.
    selected_cosmetic = "default"
    unlocked_cosmetics: list[str] = []

    # Single session transaction; commit happens in get_db().
    return ClickIncrementResponse(
        device_id=user_id,
        my_clicks=user.total_clicks,
        global_clicks=global_counter.total_clicks,
        selected_cosmetic=selected_cosmetic,
        unlocked_cosmetics=unlocked_cosmetics,
        occurred_at=utc_now(),
        schema_version=1,
    )