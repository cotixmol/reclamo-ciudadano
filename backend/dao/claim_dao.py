from abc import ABC, abstractmethod
from uuid import UUID
from typing import List
from sqlmodel import Session, select, orm
from models.claim import Claim
from utils import (
    wkb_element_to_geometry_point,
    geometry_point_to_wkb_element,
    update_claim_request_element_to_geometry_point,
)
from errors.claim_errors import (
    ClaimNotFoundError,
    ClaimNotFoundToDeleteError,
    ClaimNotCreatedError,
    ClaimNotConvertedError,
    ClaimNotUpdatedError,
)
from custom_types import GeometryPoint
from sqlalchemy.exc import SQLAlchemyError


class ClaimDAO(ABC):
    @abstractmethod
    def read_all_claims_by_public_ids(
        self, db: Session, public_ids: List[UUID]
    ) -> List[Claim]:
        pass

    @abstractmethod
    def read_claim_by_public_id(self, db: Session, public_id: UUID) -> Claim:
        pass

    @abstractmethod
    def delete_claim_by_public_id(self, db: Session, public_id: UUID) -> Claim:
        pass

    @abstractmethod
    def create_claim(self, db: Session, claim: Claim) -> Claim:
        pass

    @abstractmethod
    def update_claim_by_public_id(
        self, db: Session, claim: Claim, public_id: UUID
    ) -> Claim:
        pass


class ClaimSQLAlchemy(ClaimDAO):
    def read_all_claims_by_public_ids(
        self, db: Session, public_ids: List[UUID]
    ) -> List[Claim]:
        statement = select(Claim).where(Claim.public_id.in_(public_ids))
        try:
            results = db.exec(statement).all()
            if not results:
                return []
            for claim in results:
                claim.claim_location = wkb_element_to_geometry_point(
                    claim.claim_location
                )

            return results
        except SQLAlchemyError as e:
            raise Exception(f"Database error listing claims: {e}")
        except ClaimNotConvertedError as e:
            raise e
        except Exception as e:
            raise Exception(f"An unexpected error occurred listing claims: {e}")

    def read_claim_by_public_id(self, db: Session, public_id: UUID) -> Claim:
        statement = select(Claim).where(Claim.public_id == public_id)
        try:
            result = db.exec(statement).first()
            if result:
                result.claim_location = wkb_element_to_geometry_point(
                    result.claim_location
                )
                return result
            else:
                raise ClaimNotFoundError(claim_id=public_id, message="Claim not found")
        except SQLAlchemyError as e:
            raise Exception(
                f"Database error fetching claim with public_id {public_id}: {e}"
            )
        except ClaimNotConvertedError as e:
            raise e
        except Exception as e:
            raise ClaimNotFoundError(claim_id=public_id, message=str(e))

    def delete_claim_by_public_id(self, db: Session, public_id: UUID) -> Claim:
        statement = select(Claim).where(Claim.public_id == public_id)
        try:
            claim = db.exec(statement).first()
            if claim:
                db.delete(claim)
                db.commit()
                claim.claim_location = wkb_element_to_geometry_point(
                    claim.claim_location
                )
                return claim
            else:
                raise ClaimNotFoundToDeleteError(claim_id=public_id)
        except SQLAlchemyError as e:
            db.rollback()
            raise Exception(
                f"Database error deleting claim with public_id {public_id}: {e}"
            )
        except Exception as e:
            db.rollback()
            raise ClaimNotFoundToDeleteError(
                claim_id=public_id,
                message=f"An unexpected error occurred deleting claim with public_id {public_id}: {e}",
            )

    def create_claim(self, db: Session, claim: Claim) -> Claim:
        try:
            claim.claim_location = geometry_point_to_wkb_element(claim.claim_location)
            db.add(claim)
            db.commit()
            db.refresh(claim)
            claim.claim_location = wkb_element_to_geometry_point(claim.claim_location)
            return claim
        except SQLAlchemyError as e:
            db.rollback()
            raise Exception(f"Database error creating claim: {e}")
        except ClaimNotConvertedError as e:
            db.rollback()
            raise e
        except Exception as e:
            db.rollback()
            raise ClaimNotCreatedError(
                message=f"An unexpected error occurred creating claim: {e}"
            )

    def update_claim_by_public_id(
        self, db: Session, claim: Claim, public_id: UUID
    ) -> Claim:
        statement = select(Claim).where(Claim.public_id == public_id)
        try:
            claim_to_update = db.exec(statement).first()
            if claim_to_update:
                updated_data = claim.model_dump(
                    exclude_unset=True,
                    exclude={"id", "public_id", "created_at", "updated_at"},
                )
                # Convert location if present in updated data
                if updated_data.get("claim_location") and updated_data[
                    "claim_location"
                ].get("coordinates"):
                    updated_data["claim_location"] = (
                        update_claim_request_element_to_geometry_point(
                            updated_data["claim_location"]["coordinates"]
                        )
                    )

                for key, value in updated_data.items():
                    setattr(claim_to_update, key, value)

                if claim_to_update.claim_location:
                    claim_to_update.claim_location = geometry_point_to_wkb_element(
                        claim_to_update.claim_location
                    )

                db.add(claim_to_update)
                db.commit()
                db.refresh(claim_to_update)
                claim_to_update.claim_location = wkb_element_to_geometry_point(
                    claim_to_update.claim_location
                )
                return claim_to_update
            else:
                raise ClaimNotFoundError(claim_id=public_id)
        except SQLAlchemyError as e:
            db.rollback()
            raise Exception(
                f"Database error updating claim with public_id {public_id}: {e}"
            )
        except ClaimNotConvertedError as e:
            db.rollback()
            raise e
        except Exception as e:
            db.rollback()
            raise ClaimNotUpdatedError(
                message=f"An unexpected error occurred updating claim with public_id {public_id}: {e}"
            )
