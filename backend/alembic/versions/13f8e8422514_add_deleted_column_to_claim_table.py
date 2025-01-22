"""Add deleted column to claim table

Revision ID: 13f8e8422514
Revises: 11d36653ec82
Create Date: 2025-01-22 16:43:49.034537

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "13f8e8422514"
down_revision: Union[str, None] = "11d36653ec82"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Add the column with a default value for existing records
    op.add_column(
        "claim",
        sa.Column(
            "deleted", sa.Boolean(), nullable=False, server_default=sa.text("false")
        ),
    )
    # Remove the server default after setting the default value (optional)
    op.alter_column("claim", "deleted", server_default=None)


def downgrade() -> None:
    # Drop the column
    op.drop_column("claim", "deleted")
