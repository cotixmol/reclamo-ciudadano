from sqlmodel import Session, select
from models import ApiKey


class AuthDAO:
    def get_api_key(self, db: Session, key: str):
        statement = select(ApiKey).where(ApiKey.key == key, ApiKey.active == True)
        return db.exec(statement).first()
