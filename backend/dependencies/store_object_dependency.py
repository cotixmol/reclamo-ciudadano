from service.claim_service import ClaimService
from service.store_object_service import StoreObjectService
from repository import StoreObjectRepository
from fastapi import Depends


def get_store_object_service() -> StoreObjectService:
    store_object_repository = StoreObjectRepository()
    return StoreObjectService(repository=store_object_repository)
