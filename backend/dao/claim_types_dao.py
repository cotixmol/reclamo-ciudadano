from abc import ABC, abstractmethod
from typing import List
from sqlmodel import Session, select
from models import ClaimTypes
from sqlalchemy.exc import SQLAlchemyError


class ClaimTypesDAO(ABC):
    @abstractmethod
    def load_all_claims_at_bootstart(self, db: Session) -> List[ClaimTypes]:
        pass


class ClaimTypesSQLAlchemy(ClaimTypesDAO):
    def load_all_claims_at_bootstart(self, db: Session) -> List[ClaimTypes]:
        statement = select(ClaimTypes)
        try:
            results = db.exec(statement).all()

            if not results:
                return []

            return results
        except SQLAlchemyError as e:
            raise Exception(f"Database error listing claims: {e}")
        except Exception as e:
            raise Exception(f"An unexpected error occurred listing claims: {e}")
