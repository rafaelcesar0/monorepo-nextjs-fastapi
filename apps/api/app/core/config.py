import os
from dataclasses import dataclass


@dataclass(frozen=True)
class Settings:
    env: str = os.getenv("ENVIRONMENT", "development")

    @property
    def is_dev(self) -> bool:
        return self.env.lower() != "production"

    @property
    def cors_origins(self) -> list[str]:
        if not self.is_dev:
            return []
        raw_origins = (
            os.getenv("CORS_ORIGINS")
            or os.getenv("CORS_ORIGIN")
            or "http://localhost:3000"
        )
        return [origin.strip() for origin in raw_origins.split(",") if origin.strip()]


settings = Settings()
