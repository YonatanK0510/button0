"""Database configuration and session management for SQLAlchemy 2.0"""
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from app.config import settings

# Create engine from environment variable
engine = create_engine(
    settings.database_url,
    echo=False,  # Set to True for SQL query logging in development
    pool_pre_ping=True,  # Verify connections before use
)

# Create session factory
SessionLocal = sessionmaker(
    bind=engine,
    autocommit=False,
    autoflush=False,
    expire_on_commit=False,
)


def get_db() -> Session:
    """
    FastAPI dependency for database sessions.
    Yields a session and ensures it's closed after use.
    """
    db = SessionLocal()
    try:
        yield db
        db.commit()
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()