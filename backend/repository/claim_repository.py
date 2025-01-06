from models import Claim
from sqlmodel import Session
from typing import List
from dao.claim_dao import ClaimDAO, ClaimSQLAlchemy
from sqlalchemy.exc import NoResultFound
from errors.claim_errors import ClaimsNotFound, ClaimNotFound, ClaimNotFoundToDelete


class ClaimRepository:
    def __init__(self, db_reporte_ciudadano: Session, claim_dao: ClaimDAO = None):
        self.db_reporte_ciudadano = db_reporte_ciudadano
        self.claim_dao = claim_dao or ClaimSQLAlchemy()

    def read_all_claims(self) -> List[Claim]:
        try:
            for db in self.db_reporte_ciudadano.get_session_generator():
                return self.claim_dao.read_all_claims(db)
        except ClaimsNotFound:
            raise
        except Exception as e:
            raise e

    def read_claim_by_id(self, claim_id) -> Claim:
        try:
            for db in self.db_reporte_ciudadano.get_session_generator():
                return self.claim_dao.read_claim_by_id(db, claim_id)
        except ClaimNotFound:
            raise
        except Exception as e:
            raise e

    def delete_claim_by_id(self, claim_id) -> Claim:
        try:
            for db in self.db_reporte_ciudadano.get_session_generator():
                return self.claim_dao.delete_claim_by_id(db, claim_id)
        except ClaimNotFoundToDelete:
            raise
        except Exception as e:
            raise e
