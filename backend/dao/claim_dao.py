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
    ClaimNotConvertedError,
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
            raise Exception(f"Database error listing claims: {e}")

        if results:
            try:
                for claim in results:
                    claim.claim_location = wkb_element_to_geometry_point(
                        claim.claim_location
                    )
                return results
            except Exception as e:
                raise ClaimNotConvertedError(errors=e)
        else:
            raise ClaimsNotFoundError()

    def read_claim_by_id(self, db: Session, claim_id: int) -> Claim:
        statement = select(Claim).where(Claim.id == claim_id)
        try:
            result = db.exec(statement).first()
        except SQLAlchemyError as e:
            raise Exception(f"Database error listing claim with id {claim_id}: {e}")

        if result:
            try:
                result.claim_location = wkb_element_to_geometry_point(
                    result.claim_location
                )
                return result
            except Exception as e:
                raise ClaimNotConvertedError(errors=e)
        else:
            raise ClaimNotFoundError(claim_id=claim_id)

    def delete_claim_by_id(self, db: Session, claim_id: int) -> Claim:
        statement = select(Claim).where(Claim.id == claim_id)
        try:
            result = db.exec(statement).first()
            if result:
                db.delete(result)
                db.commit()
                return result
            else:
                raise ClaimNotFoundToDeleteError(claim_id=claim_id)
        except SQLAlchemyError as e:
            db.rollback()
            raise Exception(f"Database error deleting claim with id {claim_id}: {e}")

    def create_claim(self, db: Session, claim: Claim) -> Claim:
        try:
            try:
                claim.claim_location = geometry_point_to_wkb_element(
                    claim.claim_location
                )
            except Exception as e:
                raise ClaimNotConvertedError(errors=e)
            db.add(claim)
            db.commit()
            db.refresh(claim)
            try:
                claim.claim_location = wkb_element_to_geometry_point(
                    claim.claim_location
                )
                return claim
            except Exception as e:
                raise ClaimNotConvertedError(errors=e)
        except SQLAlchemyError as e:
            db.rollback()
            raise Exception(f"Database error creating claim: {e}")
        except Exception as e:
            db.rollback()
            raise ClaimNotCreatedError(
                f"An unexpected error occurred creating claim: {e}"
            )
