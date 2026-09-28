from dataclasses import dataclass

import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.config import settings

bearer_scheme = HTTPBearer(auto_error=False)

# Caches Keycloak's public keys and refetches when an unknown key id appears
jwks_client = jwt.PyJWKClient(settings.keycloak_jwks_url, cache_keys=True)


@dataclass
class CurrentUser:
    subject: str
    username: str
    email: str


def _unauthorized(detail: str) -> HTTPException:
    return HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail=detail,
        headers={"WWW-Authenticate": "Bearer"},
    )


def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer_scheme),
) -> CurrentUser:
    if credentials is None:
        raise _unauthorized("Not authenticated")

    token = credentials.credentials
    try:
        signing_key = jwks_client.get_signing_key_from_jwt(token)
        claims = jwt.decode(
            token,
            signing_key.key,
            algorithms=["RS256"],
            issuer=settings.keycloak_issuer,
            # Keycloak access tokens for a public client carry no useful "aud"; check "azp" instead
            options={"verify_aud": False, "require": ["exp", "iss", "sub"]},
        )
    except jwt.PyJWKClientError as e:
        raise HTTPException(status.HTTP_503_SERVICE_UNAVAILABLE, f"Cannot fetch signing keys: {e}")
    except jwt.InvalidTokenError as e:
        raise _unauthorized(f"Invalid token: {e}")

    if claims.get("azp") != settings.keycloak_client_id:
        raise _unauthorized("Token was not issued for this client")

    email = claims.get("email")
    if not email:
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Token has no email claim")
    # Users are linked by email, so only trust verified addresses
    if not claims.get("email_verified", False):
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Email address is not verified")

    return CurrentUser(
        subject=claims["sub"],
        username=claims.get("preferred_username", ""),
        email=email,
    )
