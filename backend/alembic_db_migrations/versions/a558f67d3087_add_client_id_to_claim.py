"""add client_id to claim

Revision ID: a558f67d3087
Revises: b19a7d8a4280
Create Date: 2025-05-21 11:18:43.784663

"""

from alembic import op
import sqlalchemy as sa

revision = "a558f67d3087"
down_revision = "b19a7d8a4280"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # 1 ─ add column (nullable)
    op.add_column("claim", sa.Column("client_id", sa.Integer(), nullable=True))

    # 2 ─ foreign key
    op.create_foreign_key(
        "fk_claim_client", "claim", "clients", ["client_id"], ["id"], ondelete="CASCADE"
    )

    # 3 ─ look-up legacy client id
    conn = op.get_bind()
    legacy_id = conn.execute(
        sa.text("SELECT id FROM clients WHERE name = 'Legacy Client' LIMIT 1")
    ).scalar_one_or_none()

    if legacy_id is None:
        raise RuntimeError(
            "Migration abort: 'Legacy Client' row not found.\n"
            "Run python -m config.create_master_user before alembic upgrade."
        )

    # 4 ─ back-fill existing rows  ← **the piece that was missing**
    op.execute(
        sa.text(
            "UPDATE claim SET client_id = :legacy WHERE client_id IS NULL"
        ).bindparams(legacy=legacy_id)
    )

    # 5 ─ now it’s safe to make NOT NULL and add index
    op.alter_column("claim", "client_id", nullable=False)
    op.create_index("ix_claim_client_id", "claim", ["client_id"])


def downgrade() -> None:
    op.drop_index("ix_claim_client_id", table_name="claim")
    op.drop_constraint("fk_claim_client", "claim", type_="foreignkey")
    op.drop_column("claim", "client_id")
