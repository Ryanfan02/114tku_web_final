from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    MONGO_URL: str
    MONGO_DB: str

    JWT_SECRET: str
    JWT_EXPIRE_MINUTES: int = 60 * 24 * 7  

    CORS_ORIGINS: str = "http://localhost:5173"

    class Config:
        env_file = ".env"


settings = Settings()
