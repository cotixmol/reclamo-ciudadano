from repository import StoreObjectRepository
from models import Claim


class StoreObjectService:
    def __init__(self, repository: StoreObjectRepository):
        self.repository = repository

    def generate_presigned_urls(self, claim: Claim):
        try:
            return self.repository.generate_presigned_urls(claim)
        except Exception as e:
            raise Exception(f"Error generating presigned URLs: {e}")
