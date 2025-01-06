class ClaimService:
    def __init__(self, repository):
        self.repository = repository

    def read_all_claims(self):
        return self.repository.read_all_claims()
