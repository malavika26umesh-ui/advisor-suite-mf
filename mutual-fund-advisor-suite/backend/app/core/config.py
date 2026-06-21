from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file="../.env", env_file_encoding="utf-8", extra="ignore")

    GROQ_API_KEY: str = ""
    HUGGINGFACEHUB_API_TOKEN: str = ""
    PINECONE_API_KEY: str = ""
    PINECONE_INDEX_NAME: str = "mf-advisor-suite"
    SENDGRID_API_KEY: str = ""
    ELEVENLABS_API_KEY: str = ""
    DATABASE_URL: str = "sqlite+aiosqlite:///./dev.db"
    SECRET_KEY: str = ""
    ADMIN_REFRESH_TOKEN: str = ""
    FRONTEND_URL: str = "http://localhost:5173"


settings = Settings()
