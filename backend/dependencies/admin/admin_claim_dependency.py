from dao.admin import AdminClaimSQLAlchemy
from repository.admin import AdminClaimRepository
from config.db import db_reporte_ciudadano
from service.admin import AdminClaimService


def get_admin_claim_service() -> AdminClaimService:
    admin_dao_claim = AdminClaimSQLAlchemy()
    admin_claim_repository = AdminClaimRepository(db_reporte_ciudadano, admin_dao_claim)
    return AdminClaimService(repository=admin_claim_repository)
