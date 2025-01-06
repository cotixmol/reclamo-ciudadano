from errors.claim_errors import ClaimsNotFound, ClaimNotFound


class ClaimService:
    def __init__(self, repository):
        self.repository = repository

    def read_all_claims(self):
        try:
            return self.repository.read_all_claims()
        except ClaimsNotFound:
            raise

    def read_claim_by_id(self, claim_id):
        try:
            return self.repository.read_claim_by_id(claim_id)
        except ClaimNotFound:
            raise
