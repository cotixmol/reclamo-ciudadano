class MinioService:
    def __init__(self, repository):
        self.repository = repository

    def generate_presigned_url(self, claim):
        try:
            return self.repository.generate_presigned_url(claim)
        except Exception as e:
            raise e
