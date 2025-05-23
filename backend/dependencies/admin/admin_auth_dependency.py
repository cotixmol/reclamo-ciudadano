from config.db import db_reporte_ciudadano
from dao.admin import AdminUserSQLAlchemy
from repository.admin import AdminUserRepository
from service.admin import AdminAuthService


def get_admin_auth_service() -> AdminAuthService:
    dao = AdminUserSQLAlchemy()
    repo = AdminUserRepository(db_reporte_ciudadano, dao)
    return AdminAuthService(repo)
