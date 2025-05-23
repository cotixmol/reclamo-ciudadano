# repository/admin_user_repository.py
from sqlmodel import Session
from fastapi import HTTPException, status
from dao.admin import AdminUserSQLAlchemy


class AdminUserRepository:
    def __init__(
        self, db_reporte_ciudadano: Session, admin_user_dao: AdminUserSQLAlchemy
    ):
        self.db_reporte_ciudadano = db_reporte_ciudadano
        self.admin_user_dao = admin_user_dao

    def authenticate(self, client_id: int, email: str, password: str):
        try:
            for db in self.db_reporte_ciudadano.get_session_generator():
                user = self.admin_user_dao.get_by_email_and_client(db, client_id, email)
                if not (user and user.verify_pw(password)):
                    raise HTTPException(
                        status_code=status.HTTP_401_UNAUTHORIZED,
                        detail="invalidCredentials",
                    )
                return user
        except Exception as e:
            raise e
