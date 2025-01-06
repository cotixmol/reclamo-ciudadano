from abc import ABC, abstractmethod
from typing import List
from sqlmodel import Session, select
from models.claim import Claim
from utils import wkb_element_to_geometry_point


class ClaimDAO(ABC):
    @abstractmethod
    def read_all_claims(self, db: Session) -> List[Claim]:
        pass


class ClaimSQLAlchemy(ClaimDAO):
    def read_all_claims(self, db: Session) -> List[Claim]:
        statement = select(Claim)
        results = db.exec(statement).all()
        for claim in results:
            claim.claim_location = wkb_element_to_geometry_point(claim.claim_location)
        return results

    def read_claim_by_id(self, db: Session, claim_id: int) -> Claim:
        statement = select(Claim).where(Claim.id == claim_id)
        result = db.exec(statement).first()
        result.claim_location = wkb_element_to_geometry_point(result.claim_location)
        return result
