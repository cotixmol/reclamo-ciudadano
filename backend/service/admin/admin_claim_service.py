from errors.admin import ClaimsNotFoundByClientError
from uuid import UUID
from repository.admin import AdminClaimRepository


class AdminClaimService:
    def __init__(self, repository: AdminClaimRepository):
        self.repository = repository

    def read_all_claims_by_client_id(self, client_id: UUID):
        try:
            return self.repository.read_all_claims_by_client_id(client_id)
        except ClaimsNotFoundByClientError:
            raise
