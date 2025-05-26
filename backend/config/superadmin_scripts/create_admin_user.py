#!/usr/bin/env python3
"""
┌─────────────────────────────────────────────────────────────────────────────┐
│ SUPER-ADMIN TOOL (temporary)                                                │
└─────────────────────────────────────────────────────────────────────────────┘

• Purpose
  Create ONE admin user (email + bcrypt-hashed password) that belongs to
  the client that owns a given API-key.  
  Only the software provider (“Reputación Digital") should run this.

• Why this lives in a script
  In the long-term we’ll expose the same action as
      POST /superadmin/users
  guarded by a SuperAdmin JWT / API-key and implemented via
      SuperAdminUserRouter → SuperAdminUserService → SuperAdminUserRepository.
  Until that router exists, this script is the fastest unblocker for ops.


• Run examples  (project root)
    python -m config.superadmin_scripts.create_admin_user \
        --api-key  "fe1f8ae9c0…" \
        --email    "admin@reputacion.digital" \
        --password "password"

  The script exits non-zero on duplicate e-mail or unknown / inactive key.

• Safe to re-run?
  Yes. It refuses to create a second user with the same e-mail in the same
  tenant.

Delete this script once the /superadmin API is in place.
"""

import click
from getpass import getpass
from sqlmodel import select
from passlib.hash import bcrypt

from config.db import db_reporte_ciudadano  # ← your session provider
from models.api_key import ApiKey
from models.admin import AdminUser


def _open_session():
    """
    Convenience wrapper so we can use `with _open_session() as db:`
    regardless of how DatabaseReporteCiudadano is implemented.
    """
    return db_reporte_ciudadano.get_session()


@click.command()
@click.option("--api-key", prompt=True, hide_input=True)
@click.option("--email", prompt=True)
@click.option(
    "--password",
    prompt=False,
    help="If omitted, you'll be prompted securely.",
)
def create_admin_user(api_key: str, email: str, password: str | None):
    if not password:
        password = getpass("Password: ")

    with _open_session() as db:
        # 1️⃣  Resolve API key → client_id
        key_row = db.exec(
            select(ApiKey).where(ApiKey.key == api_key, ApiKey.active.is_(True))
        ).first()

        if not key_row:
            click.secho("❌  API key not found or inactive", fg="red")
            raise SystemExit(1)

        client_id = key_row.client_id

        # 2️⃣  Prevent duplicate emails inside the same client
        duplicate = db.exec(
            select(AdminUser).where(
                AdminUser.client_id == client_id, AdminUser.email == email
            )
        ).first()
        if duplicate:
            click.secho("❌  Email already exists for this client", fg="red")
            raise SystemExit(1)

        # 3️⃣  Create and commit
        user = AdminUser(
            client_id=client_id,
            email=email,
            hashed_password=bcrypt.hash(password),
        )
        db.add(user)
        db.commit()
        click.secho(
            f"✅  Created admin user '{email}' for client_id={client_id}", fg="green"
        )


if __name__ == "__main__":
    create_admin_user()
