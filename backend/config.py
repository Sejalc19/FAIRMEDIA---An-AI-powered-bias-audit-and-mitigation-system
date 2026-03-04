"""
Configuration management using Pydantic Settings.
Loads configuration from environment variables and .env file.
"""

from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""
    
    # API Configuration
    API_HOST: str = "0.0.0.0"
    API_PORT: int = 8000
    API_RELOAD: bool = True
    ALLOWED_ORIGINS: List[str] = ["http://localhost:8501"]
    
    # Storage Configuration
    STORAGE_MODE: str = "local"  # "local" or "aws"
    LOCAL_STORAGE_PATH: str = "./data/audit_logs"
    
    # AWS Configuration
    AWS_REGION: str = "us-east-1"
    AWS_ACCESS_KEY_ID: str = ""
    AWS_SECRET_ACCESS_KEY: str = ""
    DYNAMODB_TABLE_NAME: str = "fairmedia-audit-logs"
    S3_BUCKET_NAME: str = "fairmedia-logs"
    
    # Service Endpoints
    AI_SERVICE_URL: str = "http://localhost:8001"
    FAIRNESS_SERVICE_URL: str = "http://localhost:8002"
    
    # Feature Flags
    ENABLE_AUTHENTICATION: bool = False
    ENABLE_RATE_LIMITING: bool = False
    
    class Config:
        env_file = ".env"
        case_sensitive = True


# Global settings instance
settings = Settings()
