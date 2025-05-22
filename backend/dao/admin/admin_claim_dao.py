from abc import ABC, abstractmethod
from uuid import UUID

from sqlmodel import Session, select
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import selectinload
from models import Claim, Client
from utils import wkb_element_to_geometry_point
from errors.claim_errors import (
    ClaimNotConvertedError,
)

from errors.admin import ClaimsNotFoundByClientError
from custom_types import ClaimProcessingStateEnum


class AdminClaimDAO(ABC):
    @abstractmethod
    def read_all_claims_by_client_id(self, db: Session, client_id: UUID) -> Claim:
        pass


class AdminClaimSQLAlchemy(AdminClaimDAO):
    def read_all_claims_by_client_id(
        self, db: Session, client_public_id: UUID
    ) -> Claim:
        """
        Return all FINISHED claims that belong to the client whose *public* UUID
        is ``client_public_id``.
        """
        client_id_subq = (
            select(Client.id)
            .where(Client.public_id == client_public_id)
            .scalar_subquery()
        )
        statement = (
            select(Claim)
            .where(Claim.client_id == client_id_subq)
            .where(Claim.processing_state == ClaimProcessingStateEnum.FINISHED)
            .options(selectinload(Claim.multimedia))
        )
        try:
            results = db.exec(statement).all()
            if not results:
                return []
            for claim in results:
                if claim.claim_location:
                    claim.claim_location = wkb_element_to_geometry_point(
                        claim.claim_location
                    )
            return results
        except SQLAlchemyError as e:
            raise Exception(
                f"Database error fetching claims for client {client_public_id}: {e}"
            )
        except ClaimNotConvertedError as e:
            raise ClaimNotConvertedError(errors=e)
        except Exception as e:
            raise Exception(f"An unexpected error occurred listing claims: {e}")
