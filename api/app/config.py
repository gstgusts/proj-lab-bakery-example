from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    database_url: str = "postgresql+psycopg://app:app@localhost:5432/app"

    # "iss" claim in tokens: the Keycloak URL as seen by the browser
    keycloak_issuer: str = "http://localhost:8080/realms/example"
    # Where the API fetches signing keys (inside Docker this is http://keycloak:8080/...)
    keycloak_jwks_url: str = "http://localhost:8080/realms/example/protocol/openid-connect/certs"
    # Client the token must have been issued to ("azp" claim)
    keycloak_client_id: str = "web"


settings = Settings()
