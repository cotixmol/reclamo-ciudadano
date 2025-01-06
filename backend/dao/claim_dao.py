from abc import ABC, abstractmethod
from typing import List
from sqlmodel import Session, select, orm
from models.claim import Claim
from utils import wkb_element_to_geometry_point, geometry_point_to_wkb_element
from errors.claim_errors import (
    ClaimNotFoundError,
    ClaimsNotFoundError,
    ClaimNotFoundToDeleteError,
    ClaimNotCreatedError,
)
from sqlalchemy.exc import SQLAlchemyError


class ClaimDAO(ABC):
    @abstractmethod
    def read_all_claims(self, db: Session) -> List[Claim]:
        pass

    @abstractmethod
    def read_claim_by_id(self, db: Session, claim_id: int) -> Claim:
        pass

    @abstractmethod
    def delete_claim_by_id(self, db: Session, claim_id: int) -> Claim:
        pass

    @abstractmethod
    def create_claim(self, db: Session, claim: Claim) -> Claim:
        pass


class ClaimSQLAlchemy(ClaimDAO):
    def read_all_claims(self, db: Session) -> List[Claim]:
        statement = select(Claim)
        try:
            results = db.exec(statement).all()
        except SQLAlchemyError as e:
            raise Exception(f"Database error: {e}")

        if results:
            for claim in results:
                claim.claim_location = wkb_element_to_geometry_point(
                    claim.claim_location
                )
            return results
        else:
            raise ClaimsNotFoundError()

    def read_claim_by_id(self, db: Session, claim_id: int) -> Claim:
        statement = select(Claim).where(Claim.id == claim_id)
        try:
            result = db.exec(statement).first()
        except SQLAlchemyError as e:
            raise Exception(f"Database error: {e}")

        if result:
            result.claim_location = wkb_element_to_geometry_point(result.claim_location)
            return result
        else:
            raise ClaimNotFoundError(claim_id)

    def delete_claim_by_id(self, db: Session, claim_id: int) -> Claim:
        statement = select(Claim).where(Claim.id == claim_id)
        try:
            result = db.exec(statement).first()
        except SQLAlchemyError as e:
            raise Exception(f"Database error: {e}")

        if result:
            try:
                db.delete(result)
                db.commit()
            except SQLAlchemyError as e:
                db.rollback()
                raise Exception(f"Database error: {e}")
            return result
        else:
            raise ClaimNotFoundToDeleteError(claim_id)

    def create_claim(self, db: Session, claim: Claim) -> Claim:
        try:
            claim.claim_location = geometry_point_to_wkb_element(claim.claim_location)
            db.add(claim)
            db.commit()
            db.refresh(claim)
            return claim
        except SQLAlchemyError as e:
            db.rollback()
            print(f"Error creating claim: {e}")
            raise ClaimNotCreatedError()
        except Exception as e:
            db.rollback()
            raise Exception(f"An unexpected error occurred while creating a claim: {e}")
