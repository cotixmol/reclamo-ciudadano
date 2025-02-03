from repository import StoreObjectRepository
from models import Claim
from typing import List


class StoreObjectService:
    def __init__(self, repository: StoreObjectRepository):
        self.repository = repository

    def generate_presigned_write_urls(self, claim: Claim) -> dict:
        try:
            return self.repository.generate_presigned_write_urls(claim)
        except Exception as e:
            raise Exception(f"Error generating presigned write URLs: {e}") from e

    def generate_presigned_read_url(self, claim: Claim) -> Claim:
        try:
            return self.repository.generate_presigned_read_url_for_claim(claim)
        except Exception as e:
            raise Exception(f"Error generating presigned read URL: {e}") from e

    def generate_presigned_read_urls(self, claims: List[Claim]) -> List[Claim]:
        try:
            return self.repository.generate_presigned_read_urls(claims)
        except Exception as e:
            raise Exception(f"Error generating presigned read URLs: {e}") from e
