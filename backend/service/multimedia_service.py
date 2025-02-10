from typing import List
from models import Multimedia, MultimediaCreateRequest
from errors import MultimediaNotCreatedError


class MultimediaService:
    def __init__(self, repository):
        self.repository = repository

    def create_multimedia_metadata(
        self, metadata_list: List[MultimediaCreateRequest]
    ) -> List[Multimedia]:
        try:
            return self.repository.create_multimedia_metadata(metadata_list)
        except MultimediaNotCreatedError:
            raise
