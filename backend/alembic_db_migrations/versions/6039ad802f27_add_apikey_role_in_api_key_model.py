"""Add apikey role in api key model

Revision ID: 6039ad802f27
Revises: 2fab4b75a7b3
Create Date: 2025-02-13 16:09:59.006264

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "6039ad802f27"
down_revision: Union[str, None] = "2fab4b75a7b3"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Create the ENUM type "apikeyrole" with the desired values matching your Python enum.
    op.execute("CREATE TYPE apikeyrole AS ENUM ('client', 'admin', 'superadmin')")

    # Now add the new column using that enum type, with the default value 'client'.
    op.add_column(
        "api_keys",
        sa.Column(
            "role",
            sa.Enum("client", "admin", "superadmin", name="apikeyrole"),
            server_default=sa.text("'client'"),
            nullable=False,
        ),
    )


def downgrade() -> None:
    op.drop_column("api_keys", "role")
    op.execute("DROP TYPE apikeyrole")
