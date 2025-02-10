from service import MultimediaService
from dao import MultimediaSQLAlchemy
from repository import MultimediaRepository
from config.db import db_reporte_ciudadano


def get_multimedia_service() -> MultimediaService:
    dao_multimedia_types = MultimediaSQLAlchemy()
    repository = MultimediaRepository(db_reporte_ciudadano, dao_multimedia_types)
    return MultimediaService(repository=repository)
