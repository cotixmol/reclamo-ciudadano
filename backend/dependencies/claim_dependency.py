from service.claim_service import ClaimService
from dao import ClaimSQLAlchemy
from repository import ClaimRepository
from config.db import db_reporte_ciudadano


def get_claim_service() -> ClaimService:
    dao_claim = ClaimSQLAlchemy()
    claim_repository = ClaimRepository(db_reporte_ciudadano, dao_claim)
    return ClaimService(repository=claim_repository)
