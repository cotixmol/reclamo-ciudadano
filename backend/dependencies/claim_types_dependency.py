from service import ClaimTypesService
from dao import ClaimTypesSQLAlchemy
from repository import ClaimTypesRepository
from config.db import db_reporte_ciudadano


def get_claim_types_service() -> ClaimTypesService:
    dao_claim_types = ClaimTypesSQLAlchemy()
    repository = ClaimTypesRepository(db_reporte_ciudadano, dao_claim_types)
    return ClaimTypesService(repository=repository)
