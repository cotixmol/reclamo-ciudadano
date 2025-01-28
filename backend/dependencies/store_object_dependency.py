from service import StoreObjectService
from dao import ClaimSQLAlchemy
from repository import StoreObjectRepository


def get_store_object_service() -> StoreObjectService:
    repository = StoreObjectRepository()
    return StoreObjectService(repository=repository)
