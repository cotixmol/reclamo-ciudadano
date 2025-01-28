from service import MinioService
from dao import ClaimSQLAlchemy
from repository import MinioRepository


def get_minio_service() -> MinioService:
    repository = MinioRepository()
    return MinioService(repository=repository)
