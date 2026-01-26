"""PostgreSQL global state repository implementation"""
from sqlalchemy import update
from sqlalchemy.dialects.postgresql import insert
from sqlalchemy.orm import Session

from app.models import GlobalStateORM, utc_now
from app.domain.models import GlobalState


class PostgresGlobalStateRepository:
    """PostgreSQL global state storage"""

    def __init__(self, session: Session):
        self.session = session

    def get_state(self) -> GlobalState:
        model = self.session.get(GlobalStateORM, 1)
        if not model:
            model = GlobalStateORM(id=1, global_clicks=0, updated_at=utc_now())
            self.session.add(model)
            self.session.flush()
        return self._model_to_domain(model)

    def increment_clicks(self, delta: int) -> GlobalState:
        # Ensure the singleton row exists
        self.session.execute(
            insert(GlobalStateORM)
            .values(id=1, global_clicks=0, updated_at=utc_now())
            .on_conflict_do_nothing(index_elements=[GlobalStateORM.id])
        )

        stmt = (
            update(GlobalStateORM)
            .where(GlobalStateORM.id == 1)
            .values(
                global_clicks=GlobalStateORM.global_clicks + delta,
                updated_at=utc_now(),
            )
            .returning(
                GlobalStateORM.global_clicks,
                GlobalStateORM.updated_at,
            )
        )
        result = self.session.execute(stmt).one()

        return GlobalState(
            global_clicks=result.global_clicks,
            updated_at=result.updated_at,
            schema_version=1,
        )

    def _model_to_domain(self, model: GlobalStateORM) -> GlobalState:
        return GlobalState(
            global_clicks=model.global_clicks,
            updated_at=model.updated_at,
            schema_version=1,
        )