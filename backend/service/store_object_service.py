class StoreObjectService:
    def __init__(self, repository):
        self.repository = repository

    def generate_presigned_urls(self, claim):
        try:
            return self.repository.generate_presigned_urls(claim)
        except Exception as e:
            raise e
