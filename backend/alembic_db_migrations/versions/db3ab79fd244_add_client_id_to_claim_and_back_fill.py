"""add client_id to claim and back-fill

Revision ID: db3ab79fd244
Revises: f4f779552e0f
Create Date: 2025-05-22 14:19:12.244718

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "db3ab79fd244"
down_revision: Union[str, None] = "f4f779552e0f"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # 1 – add the column (nullable for the moment)
    op.add_column("claim", sa.Column("client_id", sa.Integer(), nullable=True))

    # 2 – FK to clients
    op.create_foreign_key(
        "fk_claim_client",
        source_table="claim",
        referent_table="clients",
        local_cols=["client_id"],
        remote_cols=["id"],
        ondelete="CASCADE",
    )

    conn = op.get_bind()

    # 3 – get Legacy Client id (guaranteed to exist after rev A)
    legacy_id = conn.execute(
        sa.text("SELECT id FROM clients WHERE name = 'Legacy Client'")
    ).scalar_one()

    # 4 – back-fill pre-existing claims
    conn.execute(
        sa.text("UPDATE claim SET client_id = :legacy WHERE client_id IS NULL"),
        {"legacy": legacy_id},
    )

    # 5 – enforce NOT NULL and index
    op.alter_column("claim", "client_id", nullable=False)
    op.create_index("ix_claim_client_id", "claim", ["client_id"])


def downgrade() -> None:
    op.drop_index("ix_claim_client_id", table_name="claim")
    op.drop_constraint("fk_claim_client", "claim", type_="foreignkey")
    op.drop_column("claim", "client_id")
