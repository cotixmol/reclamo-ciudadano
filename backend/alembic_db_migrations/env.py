import os
from dotenv import load_dotenv
from alembic_db_migrations.postgis_tables import EXCLUDE_TABLES

load_dotenv()
from logging.config import fileConfig

from sqlalchemy import engine_from_config, pool
from geoalchemy2 import alembic_helpers

from alembic import context
from sqlmodel import SQLModel

from models import *

# This is the Alembic Config object, which provides
# access to the values within the .ini file in use.
config = context.config

# Interpret the config file for Python logging.
if config.config_file_name is not None:
    fileConfig(config.config_file_name)


# Our SQLModel metadata:
target_metadata = SQLModel.metadata


def custom_include_object(object_, name, type_, reflected, compare_to):
    """
    Custom function to exclude certain tables from Alembic autogenerate,
    while still deferring to GeoAlchemy2's helper for PostGIS columns.
    """
    # If it's a table that we want to exclude, skip it:
    if type_ == "table" and name in EXCLUDE_TABLES:
        return False

    # Otherwise, let the geoalchemy2 default logic decide
    return alembic_helpers.include_object(object_, name, type_, reflected, compare_to)


def run_migrations_offline() -> None:
    """
    Run migrations in 'offline' mode.
    """
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
        include_object=custom_include_object,  # Use our custom function
        process_revision_directives=alembic_helpers.writer,
        render_item=alembic_helpers.render_item,
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    """
    Run migrations in 'online' mode.
    """
    DATABASE_URL = os.getenv("DATABASE_URL")
    if not DATABASE_URL:
        raise ValueError("DATABASE_URL environment variable not set")

    connectable = engine_from_config(
        config.get_section(config.config_ini_section),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
        url=DATABASE_URL,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata,
            include_object=custom_include_object,  # Use our custom function
            process_revision_directives=alembic_helpers.writer,
            render_item=alembic_helpers.render_item,
        )

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
