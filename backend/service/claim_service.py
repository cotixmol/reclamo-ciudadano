from errors import (
    ClaimNotFoundError,
    ClaimNotFoundToDeleteError,
    ClaimNotCreatedError,
    ClaimNotUpdatedError,
)
from models import Claim
from repository import ClaimRepository
from repository import ClaimRepository
from errors.claim_errors import ClaimNotCreatedError


class ClaimService:
    def __init__(self, repository: ClaimRepository):
        self.repository = repository

    def read_all_claims_by_public_ids(self, public_ids):
        try:
            return self.repository.read_all_claims_by_public_ids(public_ids)
        except Exception:
            raise

    def read_claim_by_public_id(self, public_id):
        try:
            return self.repository.read_claim_by_public_id(public_id)
        except ClaimNotFoundError:
            raise

    def delete_claim_by_public_id(self, public_id):
        try:
            return self.repository.delete_claim_by_public_id(public_id)
        except ClaimNotFoundToDeleteError:
            raise

    def create_claim(self, claim, client_id):
        try:
            new_claim = self.repository.create_claim(claim, client_id)
            return new_claim
        except ClaimNotCreatedError:
            raise

    def update_claim_by_public_id(self, claim, public_id):
        try:
            return self.repository.update_claim_by_public_id(claim, public_id)
        except ClaimNotUpdatedError:
            raise

    def update_claim_processing_state_to_failed(self, public_id):
        try:
            return self.repository.update_claim_processing_state_to_failed(public_id)
        except ClaimNotUpdatedError:
            raise

    def update_claim_processing_state_to_finished(self, public_id):
        try:
            return self.repository.update_claim_processing_state_to_finished(public_id)
        except ClaimNotUpdatedError:
            raise
