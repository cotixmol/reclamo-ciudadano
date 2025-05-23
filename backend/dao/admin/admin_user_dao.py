from abc import ABC, abstractmethod
from sqlmodel import Session, select
from models.admin import AdminUser


class AdminUserDAO(ABC):
    @abstractmethod
    def get_by_email_and_client(self, db: Session, client_id: int, email: str):
        pass


class AdminUserSQLAlchemy(AdminUserDAO):
    def get_by_email_and_client(self, db: Session, client_id: int, email: str):
        stmt = select(AdminUser).where(
            AdminUser.client_id == client_id, AdminUser.email == email
        )
        return db.exec(stmt).first()
