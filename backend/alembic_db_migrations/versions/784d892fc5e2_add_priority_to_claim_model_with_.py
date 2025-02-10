"""Add priority to Claim model with priority_enum

Revision ID: 784d892fc5e2
Revises: 68267bd5c2b6
Create Date: 2025-01-24 14:58:27.291034

"""

from typing import Sequence, Union
from custom_types import PriorityEnum
from sqlalchemy.dialects import postgresql
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "784d892fc5e2"
down_revision: Union[str, None] = "68267bd5c2b6"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### Create the enum type ###
    priority_enum = postgresql.ENUM(
        PriorityEnum.LOW.value,
        PriorityEnum.MEDIUM.value,
        PriorityEnum.HIGH.value,
        name="priority_enum",
    )
    priority_enum.create(op.get_bind())

    # ### Add the priority column ###
    op.add_column(
        "claim",
        sa.Column(
            "priority",
            sa.Enum("LOW", "MEDIUM", "HIGH", name="priority_enum"),
            nullable=False,
            server_default="LOW",  # Must match enum value exactly
        ),
    )

    op.alter_column("claim", "priority")


def downgrade() -> None:
    # ### Remove the priority column ###
    op.drop_column("claim", "priority")

    # ### Drop the enum type ###
    priority_enum = postgresql.ENUM(
        PriorityEnum.LOW.value,
        PriorityEnum.MEDIUM.value,
        PriorityEnum.HIGH.value,
        name="priority_enum",
    )
    priority_enum.drop(op.get_bind())
