"""
Configuration settings for First Contact E.I.S.
Uses Pydantic Settings for environment variable management.
Supports both local development and Cloud SQL production.
"""

from pydantic_settings import BaseSettings
from functools import lru_cache
from typing import List, Optional
import os


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""
    
    # Environment
    ENVIRONMENT: str = "development"
    
    # Database - Individual components for Cloud SQL
    DB_HOST: Optional[str] = None  # Unix socket path for Cloud SQL: /cloudsql/PROJECT:REGION:INSTANCE
    DB_NAME: str = "firstcontact"
    DB_USER: str = "postgres"
    DB_PASSWORD: Optional[str] = None
    DB_PORT: str = "5432"
    
    # Direct URL override (for local development)
    DATABASE_URL: Optional[str] = None
    
    @property
    def get_database_url(self) -> str:
        """Build database URL from components or use direct URL."""
        if self.DATABASE_URL:
            return self.DATABASE_URL
        
        # Check if this is a Cloud SQL Unix socket connection
        if self.DB_HOST and self.DB_HOST.startswith("/cloudsql/"):
            # Unix socket connection for Cloud SQL
            # Format: postgresql+asyncpg://user:pass@/dbname?host=/cloudsql/project:region:instance
            if self.DB_PASSWORD:
                return f"postgresql+asyncpg://{self.DB_USER}:{self.DB_PASSWORD}@/{self.DB_NAME}?host={self.DB_HOST}"
            else:
                return f"postgresql+asyncpg://{self.DB_USER}@/{self.DB_NAME}?host={self.DB_HOST}"
        else:
            # Standard TCP connection (local development)
            host = self.DB_HOST or "localhost"
            if self.DB_PASSWORD:
                return f"postgresql+asyncpg://{self.DB_USER}:{self.DB_PASSWORD}@{host}:{self.DB_PORT}/{self.DB_NAME}"
            else:
                return f"postgresql+asyncpg://{self.DB_USER}@{host}:{self.DB_PORT}/{self.DB_NAME}"
    
    # For SQLite fallback in testing
    @property  
    def get_sqlite_url(self) -> str:
        return "sqlite+aiosqlite:///./test.db"
    
    # JWT Authentication
    JWT_SECRET: str = "your-super-secret-jwt-key-change-in-production"
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRATION_HOURS: int = 24
    
    @property
    def jwt_secret_key(self) -> str:
        return self.JWT_SECRET
    
    @property
    def jwt_algorithm(self) -> str:
        return self.JWT_ALGORITHM
    
    # GCP
    GCP_PROJECT_ID: str = "einharjer-valhalla"
    GCP_REGION: str = "us-east5"
    
    # API
    API_V1_PREFIX: str = "/api/v1"
    DEBUG: bool = True
    
    # CORS - Allow all origins in production for now
    CORS_ORIGINS: List[str] = ["*"]
    
    # Encryption
    ENCRYPTION_KEY: str = "your-fernet-key-here"
    
    class Config:
        env_file = ".env"
        case_sensitive = False


@lru_cache()
def get_settings() -> Settings:
    """Get cached settings instance."""
    return Settings()


settings = get_settings()
