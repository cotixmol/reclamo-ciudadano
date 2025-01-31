from typing import List
from sqlmodel import Session
from dao import MultimediaDAO
from errors import MultimediaNotCreatedError
from models import Multimedia, MultimediaCreate


class MultimediaRepository:
    def __init__(self, db_reporte_ciudadano, multimedia_dao: MultimediaDAO):
        self.db_reporte_ciudadano = db_reporte_ciudadano
        self.multimedia_dao = multimedia_dao

    def create_multimedia_metadata(
        self, metadata_list: List[MultimediaCreate]
    ) -> List[Multimedia]:
        try:
            for db in self.db_reporte_ciudadano.get_session_generator():
                return self.multimedia_dao.create_multimedia_metadata(db, metadata_list)
        except MultimediaNotCreatedError as e:
            raise e
        except Exception as e:
            raise e
