#!/usr/bin/env python3
"""
┌─────────────────────────────────────────────────────────────────────────────┐
│ PLATFORM SEEDER – CREATES MASTER TENANT & SUPERADMIN KEY                   │
└─────────────────────────────────────────────────────────────────────────────┘

• Purpose
  Idempotently ensure that two baseline tenants exist:

    1. "Digital Master"  – the software provider (super-admin).
    2. "Legacy Client"              – demo / migration sandbox.

  It also guarantees **exactly one** ACTIVE API-key with role=superadmin
  attached to the Master tenant. If a key already exists, it is re-used.

• Future state
  In the future this logic will migrate into either:
    • a dedicated `/superadmin/tenants` & `/superadmin/api-keys` endpoint
      implemented via SuperAdminTenantService + SuperAdminApiKeyService.

  Until then, run this script after `alembic upgrade head` on every new
  environment.

• How to run  (project root)
    python -m config.superadmin_scripts.seed_initial_data

  Safe to execute multiple times; it **will not** create duplicates.

• Output
      Seeded:
       • Master client id  = 1
       • Legacy client id  = 2
  If a new SUPERADMIN key was generated the script prints a note, but *never*
  echoes the key value to stdout (avoid log leaks).

"""

import secrets
from sqlmodel import Session, select
from config import db_reporte_ciudadano
from models import Client, ApiKey
from custom_types import ApiKeyRole


def seed_data(session: Session) -> None:
    master_name = "Digital Master"
    legacy_name = "Legacy Client"

    # ────────────────── Clients ──────────────────
    master = session.exec(select(Client).where(Client.name == master_name)).first()
    if master is None:
        master = Client(name=master_name)
        session.add(master)
        session.commit()
        session.refresh(master)

    legacy = session.exec(select(Client).where(Client.name == legacy_name)).first()
    if legacy is None:
        legacy = Client(name=legacy_name)
        session.add(legacy)
        session.commit()
        session.refresh(legacy)

    # ────────────────── Master API key ──────────────────
    existing_key = session.exec(
        select(ApiKey).where(
            ApiKey.client_id == master.id,
            ApiKey.role == ApiKeyRole.superadmin,
            ApiKey.active.is_(True),
        )
    ).first()

    if existing_key:
        key_value = existing_key.key  # don’t print by default
        print("Master API key already exists. Skipping creation.")
    else:
        key_value = secrets.token_hex(32)
        session.add(
            ApiKey(client_id=master.id, key=key_value, role=ApiKeyRole.superadmin)
        )
        session.commit()
        print("Created new SUPERADMIN key for master client.")

    # ────────────────── Summary ──────────────────
    print("Seeded:")
    print(f" • Master client id  = {master.id}")
    print(f" • Legacy client id  = {legacy.id}")


if __name__ == "__main__":
    with db_reporte_ciudadano.get_session() as session:
        seed_data(session)
