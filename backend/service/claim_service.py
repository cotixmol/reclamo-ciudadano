from errors.claim_errors import (
    ClaimsNotFoundError,
    ClaimNotFoundError,
    ClaimNotFoundToDeleteError,
    ClaimNotCreatedError,
)


class ClaimService:
    def __init__(self, repository):
        self.repository = repository

    def read_all_claims(self):
        try:
            return self.repository.read_all_claims()
        except ClaimsNotFoundError:
            raise

    def read_claim_by_id(self, claim_id):
        try:
            return self.repository.read_claim_by_id(claim_id)
        except ClaimNotFoundError:
            raise

    def delete_claim_by_id(self, claim_id):
        try:
            return self.repository.delete_claim_by_id(claim_id)
        except ClaimNotFoundToDeleteError:
            raise

    def create_claim(self, claim):
        try:
            return self.repository.create_claim(claim)
        except ClaimNotCreatedError:
            raise
