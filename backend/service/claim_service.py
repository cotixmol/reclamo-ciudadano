class ClaimService:
    def __init__(self, repository):
        self.repository = repository

    def read_all_claims(self):
        return self.repository.read_all_claims()

    def read_claim_by_id(self, claim_id):
        return self.repository.read_claim_by_id(claim_id)
