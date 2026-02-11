"""Application configuration"""
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings loaded from environment variables"""
    
    cors_origins: str = "http://localhost:5173,http://127.0.0.1:5173"
    host: str = "0.0.0.0"
    port: int = 8000
    database_url: str = ""  # Set explicitly or build from DB_* vars
    db_host: str = "localhost"
    db_port: int = 5432
    db_name: str = "button0"
    db_user: str = "button0"
    db_password: str = ""
    repository_mode: str = "inmemory"  # "inmemory" or "postgres"
    
    class Config:
        env_file = ".env"
        case_sensitive = False
    
    def get_database_url(self) -> str:
        """
        Resolve DATABASE_URL with fallback to PostgreSQL build from DB_* vars.
        Priority:
        1. Explicit DATABASE_URL (if set and non-empty)
        2. Build from DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD
        3. Default SQLite for local dev
        """
        if self.database_url:
            return self.database_url
        
        if self.db_user and self.db_host and self.db_name:
            password_part = f":{self.db_password}" if self.db_password else ""
            return f"postgresql://{self.db_user}{password_part}@{self.db_host}:{self.db_port}/{self.db_name}"
        
        return "sqlite:///./button0.db"
    
    def get_cors_origins(self) -> list[str]:
        """Parse CORS origins from comma-separated string"""
        return [origin.strip() for origin in self.cors_origins.split(",")]


settings = Settings()