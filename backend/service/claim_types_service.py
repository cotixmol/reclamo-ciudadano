class ClaimTypesService:
    def __init__(self, repository):
        self.repository = repository

    def load_all_claims_at_bootstart(self):
        try:
            return self.repository.load_all_claims_at_bootstart()
        except Exception:
            raise
