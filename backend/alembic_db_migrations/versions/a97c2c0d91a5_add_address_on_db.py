"""Add address on db

Revision ID: a97c2c0d91a5
Revises: a873bdcc4342
Create Date: 2025-02-12 12:30:36.924607

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "a97c2c0d91a5"
down_revision: Union[str, None] = "a873bdcc4342"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    op.add_column(
        "claim",
        sa.Column(
            "address",
            sa.String(length=255),
            nullable=True,
        ),
    )


def downgrade():
    op.drop_column("claim", "address")
