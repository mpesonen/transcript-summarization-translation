from pydantic_settings import BaseSettings, SettingsConfigDict
from functools import lru_cache


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env")
    llm_model_openai: str = "gpt-5-mini"
    llm_model_google: str = "gemini-3-flash-preview"

    openai_api_key: str
    google_api_key: str

@lru_cache
def get_settings() -> Settings:
    return Settings()