from models import ClaimTypes
from sqlmodel import Session
from typing import List
from dao import ClaimTypesDAO, ClaimTypesSQLAlchemy


class ClaimTypesRepository:
    def __init__(
        self, db_reporte_ciudadano: Session, claim_types_dao: ClaimTypesDAO = None
    ):
        self.db_reporte_ciudadano = db_reporte_ciudadano
        self.claim_types_dao = claim_types_dao or ClaimTypesSQLAlchemy()

    def load_all_claims_types_at_bootstart(self) -> List[ClaimTypes]:
        try:
            for db in self.db_reporte_ciudadano.get_session_generator():
                return self.claim_types_dao.load_all_claims_types_at_bootstart(db)
        except Exception as e:
            raise e
