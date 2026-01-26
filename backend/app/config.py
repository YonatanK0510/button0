"""Application configuration"""
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings loaded from environment variables"""
    
    cors_origins: str = "http://localhost:5173,http://127.0.0.1:5173"
    host: str = "0.0.0.0"
    port: int = 8000
    database_url: str = "sqlite:///./button0.db"  # Default to SQLite for dev
    repository_mode: str = "inmemory"  # "inmemory" or "postgres"
    
    class Config:
        env_file = ".env"
        case_sensitive = False
    
    def get_cors_origins(self) -> list[str]:
        """Parse CORS origins from comma-separated string"""
        return [origin.strip() for origin in self.cors_origins.split(",")]


settings = Settings()