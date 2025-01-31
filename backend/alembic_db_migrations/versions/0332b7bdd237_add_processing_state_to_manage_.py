"""Add processing_state to manage multimedia upload errors

Revision ID: 0332b7bdd237
Revises: a04a24f2d806
Create Date: 2025-01-31 14:31:06.755716

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

claim_processing_state_enum = sa.Enum(
    "DRAFT", "FINISHED", "FAILED", name="claim_processing_state_enum"
)

# revision identifiers, used by Alembic.
revision: str = "0332b7bdd237"
down_revision: Union[str, None] = "a04a24f2d806"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    claim_processing_state_enum.create(op.get_bind())  # Create the ENUM type
    op.add_column(
        "claim",
        sa.Column(
            "processing_state",
            claim_processing_state_enum,
            nullable=False,
            server_default="DRAFT",
        ),
    )


def downgrade():
    op.drop_column("claim", "processing_state")
    claim_processing_state_enum.drop(op.get_bind())  # Drop ENUM type on downgrade
