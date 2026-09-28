# Import every model here so Base.metadata sees it (used by Alembic autogenerate)
from app.models.user import User

__all__ = ["User"]
