"""SQLAlchemy ORM models for Button0"""
from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, BigInteger, ForeignKey, UniqueConstraint, Index, DateTime
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()


def utc_now():
    """Get current UTC datetime"""
    return datetime.now(timezone.utc)


class ProfileORM(Base):
    """User profile model"""
    __tablename__ = "profiles"
    
    device_id = Column(String(255), primary_key=True, nullable=False)
    my_clicks = Column(Integer, default=0, nullable=False)
    selected_cosmetic = Column(String(255), nullable=False, default="default")
    created_at = Column(DateTime, default=utc_now, nullable=False)
    updated_at = Column(DateTime, default=utc_now, onupdate=utc_now, nullable=False)
    
    # Relationship to unlocked cosmetics
    unlocked_cosmetics = relationship(
        "UnlockedCosmeticORM",
        back_populates="profile",
        cascade="all, delete-orphan"
    )
    
    def __repr__(self):
        return f"<Profile device_id={self.device_id} clicks={self.my_clicks}>"


class UnlockedCosmeticORM(Base):
    """Cosmetic unlock tracking"""
    __tablename__ = "unlocked_cosmetics"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    device_id = Column(String(255), ForeignKey("profiles.device_id"), nullable=False)
    cosmetic_id = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=utc_now, nullable=False)
    
    # Relationship back to profile
    profile = relationship("ProfileORM", back_populates="unlocked_cosmetics")
    
    # Ensure no duplicate unlocks per device
    __table_args__ = (
        UniqueConstraint("device_id", "cosmetic_id", name="uq_device_cosmetic"),
        Index("ix_device_id", "device_id"),
    )
    
    def __repr__(self):
        return f"<UnlockedCosmetic device_id={self.device_id} cosmetic={self.cosmetic_id}>"


class GlobalStateORM(Base):
    """Global application state (singleton, id=1)"""
    __tablename__ = "global_state"
    
    id = Column(Integer, primary_key=True, default=1)
    global_clicks = Column(BigInteger, default=0, nullable=False)
    updated_at = Column(DateTime, default=utc_now, onupdate=utc_now, nullable=False)
    
    def __repr__(self):
        return f"<GlobalState global_clicks={self.global_clicks}>"


class UserORM(Base):
    __tablename__ = "users"

    user_id = Column(String, primary_key=True, index=True)
    total_clicks = Column(Integer, nullable=False, default=0)
    created_at = Column(DateTime(timezone=True), nullable=False, default=utc_now)
    last_seen = Column(DateTime(timezone=True), nullable=False, default=utc_now)


class GlobalCounterORM(Base):
    __tablename__ = "global_counter"

    # constant single row with id=1
    id = Column(Integer, primary_key=True)
    total_clicks = Column(Integer, nullable=False, default=0)