"""seed profiles for keycloak sample users

Revision ID: 0002
Revises: 0001
Create Date: 2026-09-28

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = "0002"
down_revision: Union[str, None] = "0001"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

users = sa.table(
    "users",
    sa.column("name", sa.String),
    sa.column("surname", sa.String),
    sa.column("email", sa.String),
)

EMAILS = ["user1@example.com", "user2@example.com"]


def upgrade() -> None:
    # Emails match the users in keycloak/realm-example.json
    op.bulk_insert(
        users,
        [
            {"name": "User", "surname": "One", "email": "user1@example.com"},
            {"name": "User", "surname": "Two", "email": "user2@example.com"},
        ],
    )


def downgrade() -> None:
    op.execute(users.delete().where(users.c.email.in_(EMAILS)))
