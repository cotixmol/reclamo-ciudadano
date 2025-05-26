from models import Claim, ClaimCreateRequestSchema, ClaimUpdateRequestSchema, Client
from sqlmodel import Session
from typing import List
from dao import ClaimDAO
from errors.claim_errors import (
    ClaimNotFoundError,
    ClaimNotFoundToDeleteError,
    ClaimNotCreatedError,
)


class ClaimRepository:
    def __init__(self, db_reporte_ciudadano: Session, claim_dao: ClaimDAO):
        self.db_reporte_ciudadano = db_reporte_ciudadano
        self.claim_dao = claim_dao

    def read_all_claims_by_public_ids(self, public_ids) -> List[Claim]:
        try:
            for db in self.db_reporte_ciudadano.get_session_generator():
                return self.claim_dao.read_all_claims_by_public_ids(db, public_ids)
        except Exception as e:
            raise e

    def read_claim_by_public_id(self, public_id) -> Claim:
        try:
            for db in self.db_reporte_ciudadano.get_session_generator():
                return self.claim_dao.read_claim_by_public_id(db, public_id)
        except ClaimNotFoundError as e:
            raise e
        except Exception as e:
            raise e

    def delete_claim_by_public_id(self, public_id) -> Claim:
        try:
            for db in self.db_reporte_ciudadano.get_session_generator():
                return self.claim_dao.delete_claim_by_public_id(db, public_id)
        except ClaimNotFoundToDeleteError as e:
            raise e
        except Exception as e:
            raise e

    def create_claim(self, claim: ClaimCreateRequestSchema, client_id: int):
        try:
            claim_data = Claim(**claim.model_dump(), client_id=client_id)
            claim_data.file_sizes = claim.file_sizes

            for db in self.db_reporte_ciudadano.get_session_generator():
                return self.claim_dao.create_claim(db, claim_data)
        except ClaimNotCreatedError as e:
            raise e
        except Exception as e:
            raise e

    def update_claim_by_public_id(self, claim: ClaimUpdateRequestSchema, public_id):
        try:
            for db in self.db_reporte_ciudadano.get_session_generator():
                return self.claim_dao.update_claim_by_public_id(db, claim, public_id)
        except Exception as e:
            raise e

    def update_claim_processing_state_to_failed(self, public_id):
        try:
            for db in self.db_reporte_ciudadano.get_session_generator():
                return self.claim_dao.update_claim_processing_state_to_failed(
                    db, public_id
                )
        except Exception as e:
            raise e

    def update_claim_processing_state_to_finished(self, public_id):
        try:
            for db in self.db_reporte_ciudadano.get_session_generator():
                return self.claim_dao.update_claim_processing_state_to_finished(
                    db, public_id
                )
        except Exception as e:
            raise e
