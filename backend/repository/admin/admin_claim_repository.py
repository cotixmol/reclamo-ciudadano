from models import Claim
from sqlmodel import Session
from typing import List
from dao.admin import AdminClaimDAO


class AdminClaimRepository:
    def __init__(self, db_reporte_ciudadano: Session, admin_claim_dao: AdminClaimDAO):
        self.db_reporte_ciudadano = db_reporte_ciudadano
        self.admin_claim_dao = admin_claim_dao

    def read_all_claims_by_client_id(self, client_id) -> List[Claim]:
        try:
            for db in self.db_reporte_ciudadano.get_session_generator():
                return self.admin_claim_dao.read_all_claims_by_client_id(db, client_id)
        except Exception as e:
            raise e
