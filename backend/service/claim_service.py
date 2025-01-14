from errors.claim_errors import (
    ClaimsNotFoundError,
    ClaimNotFoundError,
    ClaimNotFoundToDeleteError,
    ClaimNotCreatedError,
    ClaimNotUpdatedError,
)


class ClaimService:
    def __init__(self, repository):
        self.repository = repository

    def read_all_claims_by_public_ids(self, public_ids):
        try:
            return self.repository.read_all_claims_by_public_ids(public_ids)
        except ClaimsNotFoundError:
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

    def create_claim(self, claim):
        try:
            return self.repository.create_claim(claim)
        except ClaimNotCreatedError:
            raise

    def update_claim_by_public_id(self, claim, public_id):
        try:
            return self.repository.update_claim_by_public_id(claim, public_id)
        except ClaimNotUpdatedError:
            raise
