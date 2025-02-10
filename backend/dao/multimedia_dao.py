from abc import ABC, abstractmethod
from typing import List
from sqlmodel import Session, select
from models import Multimedia, MultimediaCreateRequest
from sqlalchemy.exc import SQLAlchemyError
from errors import MultimediaNotCreatedError, MultimediaNotFoundError


class MultimediaDAO(ABC):
    @abstractmethod
    def create_multimedia_metadata(
        self, db: Session, metadata_list: List[MultimediaCreateRequest]
    ) -> List[Multimedia]:
        pass


class MultimediaSQLAlchemy(MultimediaDAO):
    def create_multimedia_metadata(
        self, db: Session, metadata_list: List[MultimediaCreateRequest]
    ) -> List[Multimedia]:
        try:
            new_records = []
            for item in metadata_list:
                multimedia_record = Multimedia(
                    claim_id=item.claim_id,
                    s3_url=item.s3_url,
                    file_name=item.file_name,
                    file_type=item.file_type,
                    file_size=item.file_size,
                )
                db.add(multimedia_record)
                new_records.append(multimedia_record)

            db.commit()

            for record in new_records:
                db.refresh(record)

            return new_records

        except SQLAlchemyError as e:
            db.rollback()
            raise Exception(f"Database error creating multimedia: {e}")
        except Exception as e:
            db.rollback()
            raise MultimediaNotCreatedError(errors=e)
