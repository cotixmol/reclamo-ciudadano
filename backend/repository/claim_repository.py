from models import Claim
from sqlmodel import Session
from typing import List
from dao.claim_dao import ClaimDAO, ClaimSQLAlchemy
from sqlalchemy.exc import NoResultFound


class ClaimRepository:
    def __init__(self, db_reporte_ciudadano: Session, claim_dao: ClaimDAO = None):
        self.db_reporte_ciudadano = db_reporte_ciudadano
        self.claim_dao = claim_dao or ClaimSQLAlchemy()

    def read_all_claims(self) -> List[Claim]:
        try:
            for db in self.db_reporte_ciudadano.get_session_generator():
                return self.claim_dao.read_all_claims(db)
        except NoResultFound as err:
            return err
