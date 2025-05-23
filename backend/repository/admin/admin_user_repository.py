# repository/admin_user_repository.py
from sqlmodel import Session
from fastapi import HTTPException, status
from dao.admin import AdminUserSQLAlchemy


class AdminUserRepository:
    def __init__(self, db: Session, admin_user_dao: AdminUserSQLAlchemy):
        self.db = db
        self.admin_user_dao = admin_user_dao

    def authenticate(self, client_id: int, email: str, plain_pw: str):
        with self.db as db:
            user = self.admin_user_dao.get_by_email_and_client(db, client_id, email)
            if not (user and user.verify_pw(plain_pw)):
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="invalidCredentials",
                )
            return user
