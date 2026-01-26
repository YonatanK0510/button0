"""PostgreSQL profile repository implementation"""
from typing import Optional
from sqlalchemy import update
from sqlalchemy.dialects.postgresql import insert
from sqlalchemy.orm import Session

from app.models import ProfileORM, UnlockedCosmeticORM, utc_now
from app.domain.models import Profile


class PostgresProfileRepository:
    """PostgreSQL profile storage"""

    def __init__(self, session: Session):
        self.session = session

    def get_by_device_id(self, device_id: str) -> Optional[Profile]:
        model = self.session.get(ProfileORM, device_id)
        if not model:
            return None
        return self._model_to_domain(model)

    def create(self, profile: Profile) -> Profile:
        model = ProfileORM(
            device_id=profile.device_id,
            my_clicks=profile.my_clicks,
            selected_cosmetic=profile.selected_cosmetic or "default",
        )
        self.session.add(model)
        self.session.flush()
        return self._model_to_domain(model)

    def update(self, profile: Profile) -> Profile:
        current = self.session.get(ProfileORM, profile.device_id)
        if not current:
            raise ValueError(f"Profile {profile.device_id} not found")
        stmt = (
            update(ProfileORM)
            .where(ProfileORM.device_id == profile.device_id)
            .values(
                my_clicks=profile.my_clicks,
                selected_cosmetic=profile.selected_cosmetic,
                updated_at=profile.updated_at,
            )
            .returning(
                ProfileORM.device_id,
                ProfileORM.my_clicks,
                ProfileORM.selected_cosmetic,
                ProfileORM.created_at,
                ProfileORM.updated_at,
            )
        )
        row = self.session.execute(stmt).one()
        unlocked = (
            self.session.query(UnlockedCosmeticORM.cosmetic_id)
            .filter(UnlockedCosmeticORM.device_id == profile.device_id)
            .all()
        )
        unlocked_ids = [u[0] for u in unlocked]

        return Profile(
            device_id=row.device_id,
            my_clicks=row.my_clicks,
            unlocked_cosmetics=unlocked_ids if unlocked_ids else ["default"],
            selected_cosmetic=row.selected_cosmetic or "default",
            created_at=row.created_at,
            updated_at=row.updated_at,
            schema_version=1,
        )

    def increment_clicks(self, device_id: str, amount: int = 1) -> Profile:
        """Atomically increment profile clicks, creating the profile if missing."""
        # Ensure the profile row exists
        self.session.execute(
            insert(ProfileORM)
            .values(
                device_id=device_id,
                my_clicks=0,
                selected_cosmetic="default",
                created_at=utc_now(),
                updated_at=utc_now(),
            )
            .on_conflict_do_nothing(index_elements=[ProfileORM.device_id])
        )

        stmt = (
            update(ProfileORM)
            .where(ProfileORM.device_id == device_id)
            .values(
                my_clicks=ProfileORM.my_clicks + amount,
                updated_at=utc_now(),
            )
            .returning(
                ProfileORM.device_id,
                ProfileORM.my_clicks,
                ProfileORM.selected_cosmetic,
                ProfileORM.created_at,
                ProfileORM.updated_at,
            )
        )
        row = self.session.execute(stmt).one()

        unlocked = (
            self.session.query(UnlockedCosmeticORM.cosmetic_id)
            .filter(UnlockedCosmeticORM.device_id == device_id)
            .all()
        )
        unlocked_ids = [u[0] for u in unlocked]

        return Profile(
            device_id=row.device_id,
            my_clicks=row.my_clicks,
            unlocked_cosmetics=unlocked_ids if unlocked_ids else ["default"],
            selected_cosmetic=row.selected_cosmetic or "default",
            created_at=row.created_at,
            updated_at=row.updated_at,
            schema_version=1,
        )

    def _model_to_domain(self, model: ProfileORM) -> Profile:
        unlocked_models = (
            self.session.query(UnlockedCosmeticORM)
            .filter(UnlockedCosmeticORM.device_id == model.device_id)
            .all()
        )
        unlocked_ids = [uc.cosmetic_id for uc in unlocked_models]

        return Profile(
            device_id=model.device_id,
            my_clicks=model.my_clicks,
            unlocked_cosmetics=unlocked_ids if unlocked_ids else ["default"],
            selected_cosmetic=model.selected_cosmetic or "default",
            created_at=model.created_at,
            updated_at=model.updated_at,
            schema_version=1,
        )