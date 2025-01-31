from abc import ABC, abstractmethod
from typing import List
from sqlmodel import Session, select
from models import Multimedia, MultimediaCreate
from sqlalchemy.exc import SQLAlchemyError


class MultimediaDAO(ABC):
    @abstractmethod
    def create_multimedia_metadata(
        self, db: Session, metadata_list: List[MultimediaCreate]
    ) -> List[Multimedia]:
        pass


class MultimediaSQLAlchemy(MultimediaDAO):
    def create_multimedia_metadata(
        self, db: Session, metadata_list: List[MultimediaCreate]
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

            # Refresh to load generated IDs, timestamps, etc.
            for record in new_records:
                db.refresh(record)

            return new_records

        except SQLAlchemyError as e:
            raise Exception(f"Database error creating multimedia: {e}")
        except Exception as e:
            raise Exception(f"An unexpected error occurred creating multimedia: {e}")
