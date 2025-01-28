from service import ClaimService
from dao import ClaimSQLAlchemy
from repository import ClaimRepository
from config.db import db_reporte_ciudadano


def get_claim_service() -> ClaimService:
    dao_claim = ClaimSQLAlchemy()
    repository = ClaimRepository(db_reporte_ciudadano, dao_claim)
    return ClaimService(repository=repository)
