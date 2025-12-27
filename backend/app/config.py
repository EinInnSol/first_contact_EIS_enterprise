"""
Configuration settings for First Contact E.I.S.
Uses Pydantic Settings for environment variable management.
Supports both local development and Cloud SQL production.
"""

from pydantic_settings import BaseSettings
from functools import lru_cache
from typing import List, Optional
import os
import logging

logger = logging.getLogger(__name__)

class Settings(BaseSettings):
    """Application settings loaded from environment variables or Secret Manager."""
    
    # Environment
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    PILOT_MODE: bool = os.getenv("PILOT_MODE", "True").lower() == "true"
    
    # GCP Infrastructure
    GCP_PROJECT_ID: str = os.getenv("GCP_PROJECT_ID", "einharjer-valhalla")
    GCP_REGION: str = os.getenv("GCP_REGION", "us-east5")
    
    # Secret Manager Keys (Mapping names to GCP Secret IDs)
    SECRET_MAP: dict = {
        "ANTHROPIC_API_KEY": "nexus-anthropic-key",
        "jwt_secret_key": "firstcontact-jwt-secret",
        "DATABASE_URL": "firstcontact-db-url",
        "GOOGLE_MAPS_API_KEY": "nexus-maps-key",
        "FIREBASE_CONFIG": "firstcontact-firebase-config"
    }

    # API Keys & Secrets (with defaults for local dev)
    jwt_secret_key: str = os.getenv("JWT_SECRET", "nexus-dev-default-secret-key")
    jwt_algorithm: str = os.getenv("JWT_ALGORITHM", "HS256")
    ANTHROPIC_API_KEY: Optional[str] = None
    GOOGLE_MAPS_API_KEY: Optional[str] = None
    FIREBASE_CONFIG: Optional[str] = None
    
    # Database
    DATABASE_URL: str = "postgresql+asyncpg://postgres@localhost:5432/firstcontact"
    
    @property
    def get_database_url(self) -> str:
        return self.DATABASE_URL
        
    @property
    def get_sqlite_url(self) -> str:
        return "sqlite+aiosqlite:///./test.db"
    
    @property
    def is_production(self) -> bool:
        return self.ENVIRONMENT.lower() == "production"

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        if self.is_production:
            self._load_production_secrets()

    def _load_production_secrets(self):
        """
        Attempts to load secrets from GCP Secret Manager.
        """
        try:
            from google.cloud import secretmanager
            client = secretmanager.SecretManagerServiceClient()
            
            for attr, secret_id in self.SECRET_MAP.items():
                name = f"projects/{self.GCP_PROJECT_ID}/secrets/{secret_id}/versions/latest"
                try:
                    response = client.access_secret_version(request={"name": name})
                    setattr(self, attr, response.payload.data.decode("UTF-8"))
                    logger.info(f"Loaded secret: {secret_id}")
                except Exception as e:
                    logger.warning(f"Could not load secret {secret_id}: {str(e)}")
        except ImportError:
            logger.warning("google-cloud-secret-manager not installed. Skipping GCP secret load.")

    # API Configuration
    API_V1_PREFIX: str = "/api/v1"
    DEBUG: bool = os.getenv("DEBUG", "True").lower() == "true"
    
    @property
    def cors_origins(self) -> List[str]:
        """Return appropriate CORS origins based on environment."""
        if self.is_production:
            return [
                # Add your production frontend domains here
                "https://nexus-dashboard.web.app", 
                "https://first-contact-eis.web.app"
            ]
        # Allow all in development for ease of use
        return ["*"]

    class Config:
        env_file = ".env"
        case_sensitive = False

@lru_cache()
def get_settings() -> Settings:
    return Settings()

settings = get_settings()

