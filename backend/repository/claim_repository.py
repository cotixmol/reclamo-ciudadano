from models import Claim
from sqlmodel import Session
from typing import List
from dao.claim_dao import ClaimDAO, ClaimSQLAlchemy
from sqlalchemy.exc import NoResultFound
from errors.claim_errors import (
    ClaimsNotFoundError,
    ClaimNotFoundError,
    ClaimNotFoundToDeleteError,
    ClaimNotCreatedError,
)


class ClaimRepository:
    def __init__(self, db_reporte_ciudadano: Session, claim_dao: ClaimDAO = None):
        self.db_reporte_ciudadano = db_reporte_ciudadano
        self.claim_dao = claim_dao or ClaimSQLAlchemy()

    def read_all_claims(self) -> List[Claim]:
        try:
            for db in self.db_reporte_ciudadano.get_session_generator():
                return self.claim_dao.read_all_claims(db)
        except ClaimsNotFoundError as e:
            raise e
        except Exception as e:
            raise e

    def read_claim_by_id(self, claim_id) -> Claim:
        try:
            for db in self.db_reporte_ciudadano.get_session_generator():
                return self.claim_dao.read_claim_by_id(db, claim_id)
        except ClaimNotFoundError as e:
            raise e
        except Exception as e:
            raise e

    def delete_claim_by_id(self, claim_id) -> Claim:
        try:
            for db in self.db_reporte_ciudadano.get_session_generator():
                return self.claim_dao.delete_claim_by_id(db, claim_id)
        except ClaimNotFoundToDeleteError as e:
            raise e
        except Exception as e:
            raise e

    def create_claim(self, claim: Claim):
        try:
            for db in self.db_reporte_ciudadano.get_session_generator():
                return self.claim_dao.create_claim(db, claim)
        except ClaimNotCreatedError as e:
            raise e
        except Exception as e:
            raise e

    def update_claim_by_id(self, claim: Claim, claim_id):
        try:
            for db in self.db_reporte_ciudadano.get_session_generator():
                return self.claim_dao.update_claim_by_id(db, claim, claim_id)
        except Exception as e:
            raise e
