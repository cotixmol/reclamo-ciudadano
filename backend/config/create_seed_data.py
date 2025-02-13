import secrets
from sqlalchemy import select
from sqlmodel import Session
from config import db_reporte_ciudadano
from models.clients import Client
from models.api_key import ApiKey


def seed_data(session: Session):
    client_name = "Reputación Digital"
    existing_client = session.exec(
        select(Client).where(Client.name == client_name)
    ).first()
    if existing_client:
        print("Client already exists. Skipping seed data.")
        return

    client = Client(name=client_name)
    session.add(client)
    session.commit()
    session.refresh(client)
    key = secrets.token_hex(32)
    api_key_record = ApiKey(client_id=client.id, key=key)
    session.add(api_key_record)
    session.commit()
    session.refresh(api_key_record)

    print("Successfully seeded client and API key. Store the key securely!")


if __name__ == "__main__":
    with db_reporte_ciudadano.get_session() as session:
        seed_data(session)
