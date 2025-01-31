from typing import List
from models import Multimedia, MultimediaCreate


class MultimediaService:
    def __init__(self, repository):
        self.repository = repository

    def create_multimedia_metadata(
        self, metadata_list: List[MultimediaCreate]
    ) -> List[Multimedia]:
        try:
            return self.repository.create_multimedia_metadata(metadata_list)
        except Exception:
            raise
