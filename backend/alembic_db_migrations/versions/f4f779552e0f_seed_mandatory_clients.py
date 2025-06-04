"""seed mandatory clients

Revision ID: f4f779552e0f
Revises: b19a7d8a4280
Create Date: 2025-05-22 14:16:02.649978

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "f4f779552e0f"
down_revision: Union[str, None] = "b19a7d8a4280"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # 0) make name unique  ────────────────────────────────────────────────
    # safe even if the index/constraint already exists in some envs
    op.create_unique_constraint(
        "uq_clients_name",  # constraint name
        "clients",  # table
        ["name"],  # columns
    )

    # 1) insert / upsert the two rows  ────────────────────────────────────
    conn = op.get_bind()
    for name in ("Digital Master", "Legacy Client"):
        conn.execute(
            sa.text(
                """
                INSERT INTO clients (name)
                VALUES (:name)
                ON CONFLICT (name) DO NOTHING
            """
            ),
            {"name": name},
        )


def downgrade() -> None:
    conn = op.get_bind()
    conn.execute(
        sa.text(
            """
            DELETE FROM clients
            WHERE name IN ('Digital Master', 'Legacy Client')
        """
        )
    )
