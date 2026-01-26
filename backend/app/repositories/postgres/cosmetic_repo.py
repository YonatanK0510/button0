"""PostgreSQL cosmetic repository implementation"""
from sqlalchemy.orm import Session

from app.models import Profile as ProfileModel, UnlockedCosmetic as UnlockedCosmeticModel
from app.domain.models import Profile, utc_now


class PostgresCosmeticRepository:
    """PostgreSQL cosmetic operations (unlock, select)"""

    def __init__(self, session: Session):
        self.session = session

    def unlock_cosmetic(self, device_id: str, cosmetic_id: str) -> Profile:
        profile_model = (
            self.session.query(ProfileModel)
            .filter(ProfileModel.device_id == device_id)
            .first()
        )
        if not profile_model:
            raise ValueError(f"Profile {device_id} not found")

        existing = (
            self.session.query(UnlockedCosmeticModel)
            .filter(
                UnlockedCosmeticModel.device_id == device_id,
                UnlockedCosmeticModel.cosmetic_id == cosmetic_id,
            )
            .first()
        )

        if not existing:
            unlock = UnlockedCosmeticModel(
                device_id=device_id,
                cosmetic_id=cosmetic_id,
            )
            self.session.add(unlock)
            profile_model.updated_at = utc_now()
            self.session.flush()

        return self._model_to_domain(profile_model)

    def set_selected_cosmetic(self, device_id: str, cosmetic_id: str) -> Profile:
        profile_model = (
            self.session.query(ProfileModel)
            .filter(ProfileModel.device_id == device_id)
            .first()
        )
        if not profile_model:
            raise ValueError(f"Profile {device_id} not found")

        profile_model.selected_cosmetic = cosmetic_id
        profile_model.updated_at = utc_now()
        self.session.flush()

        return self._model_to_domain(profile_model)

    def _model_to_domain(self, model: ProfileModel) -> Profile:
        unlocked_models = (
            self.session.query(UnlockedCosmeticModel)
            .filter(UnlockedCosmeticModel.device_id == model.device_id)
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