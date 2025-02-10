"""Add bilingual columns to claimtypes

Revision ID: 64cff0e95ea7
Revises: 0332b7bdd237
Create Date: 2025-02-10 11:29:27.854364

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "64cff0e95ea7"
down_revision: Union[str, None] = "0332b7bdd237"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    # 0) Truncate the table to remove existing rows (and reset the identity)
    op.execute("TRUNCATE TABLE claimtypes RESTART IDENTITY CASCADE;")

    # 1) Add new columns (table is now empty, so NOT NULL is acceptable)
    op.add_column("claimtypes", sa.Column("category_en", sa.String(), nullable=False))
    op.add_column(
        "claimtypes", sa.Column("description_en", sa.String(1024), nullable=False)
    )
    op.add_column("claimtypes", sa.Column("category_es", sa.String(), nullable=True))
    op.add_column(
        "claimtypes", sa.Column("description_es", sa.String(1024), nullable=True)
    )

    # 2) Drop the old columns (if they exist)
    op.drop_column("claimtypes", "category")
    op.drop_column("claimtypes", "description")

    # 3) Insert brand-new rows with both English & Spanish data
    op.execute(
        """
        INSERT INTO claimtypes (category_en, description_en, category_es, description_es)
        VALUES
        ('Lighting', 'Burned-out streetlights, insufficient lighting, damaged light poles.', 'Iluminación', 'Farolas fundidas, iluminación insuficiente, postes de luz dañados.'),
        ('Signage', 'Damaged or missing street signs.', 'Señalización', 'Señales de tránsito dañadas o faltantes.'),
        ('Sewage', 'Broken pipes, unpleasant odors, flooding.', 'Alcantarillado', 'Tuberías rotas, olores desagradables, inundaciones.'),
        ('Streets', 'Potholes, damaged or missing speed bumps, inadequate signage at intersections.', 'Calles', 'Baches, topes dañados o faltantes, señalización inadecuada en intersecciones.'),
        ('Sanitation', 'Debris, garbage, fallen trees, illegal dumping.', 'Saneamiento', 'Escombros, basura, árboles caídos, vertidos ilegales.'),
        ('Public Safety', 'Theft, damage to public property, vandalism.', 'Seguridad Pública', 'Robo, daños a la propiedad pública, vandalismo.'),
        ('Public Health', 'Presence of disease vectors, pests, stray animals, standing water that could promote mosquito breeding.', 'Salud Pública', 'Presencia de vectores de enfermedades, plagas, animales callejeros, agua estancada propicia para mosquitos.'),
        ('Public Spaces', 'Lack of maintenance of plazas, green areas, playgrounds and public fountains.', 'Espacios Públicos', 'Falta de mantenimiento de plazas, áreas verdes, parques infantiles y fuentes públicas.'),
        ('Others', 'Claims that do not fit into the categories listed. Please detail.', 'Otros', 'Reclamos que no se adapten a las categorías listadas. Por favor, detalle.');
    """
    )


def downgrade() -> None:
    pass
