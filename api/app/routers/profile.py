from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.auth import CurrentUser, get_current_user
from app.db import get_db
from app.models import User
from app.schemas import UserProfile

router = APIRouter(prefix="/api/profile", tags=["profile"])


@router.get("", response_model=UserProfile)
def get_profile(
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> User:
    # Keycloak user is linked to the stored user by email (case-insensitive)
    user = db.scalars(
        select(User).where(func.lower(User.email) == current_user.email.lower())
    ).first()
    if user is None:
        raise HTTPException(
            status_code=404,
            detail=f"No profile found for {current_user.email}",
        )
    return user
