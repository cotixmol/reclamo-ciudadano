"""Add spatial index on claim_location

Revision ID: a873bdcc4342
Revises: 64cff0e95ea7
Create Date: 2025-02-11 19:39:20.205094

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "a873bdcc4342"
down_revision: Union[str, None] = "64cff0e95ea7"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    # Ensure PostGIS extension is enabled.
    op.execute("CREATE EXTENSION IF NOT EXISTS postgis;")
    # Create a GiST index on the claim_location column.
    op.create_index(
        "idx_claim_location", "claim", ["claim_location"], postgresql_using="gist"
    )


def downgrade():
    op.drop_index("idx_claim_location", table_name="claim")
