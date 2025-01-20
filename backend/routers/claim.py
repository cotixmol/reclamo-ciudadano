from fastapi import APIRouter, Depends, HTTPException, status
from service import ClaimService
from typing import Optional
from dependencies import get_claim_service
from models import Claim
from uuid import UUID
from typing import List
from custom_types import AllClaimsRequest
from errors.claim_errors import (
    ClaimNotFoundError,
    ClaimNotFoundToDeleteError,
    ClaimNotCreatedError,
    ClaimNotUpdatedError,
)

claim_router = APIRouter()


@claim_router.post("/claims/", response_model=List[Claim])
async def read_all_claims_by_public_ids(
    request: AllClaimsRequest,
    service: ClaimService = Depends(get_claim_service),
):
    try:
        all_claims = service.read_all_claims_by_public_ids(request.public_ids)
        return all_claims
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An unexpected error occurred: {e}",
        )


@claim_router.get("/claim/{public_id}", response_model=Claim)
async def read_claim_by_public_id(
    public_id: UUID, service: ClaimService = Depends(get_claim_service)
):
    try:
        claim = service.read_claim_by_public_id(public_id)
        return claim
    except ClaimNotFoundError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An unexpected error occurred: {e}",
        )


@claim_router.delete("/claim/{public_id}", response_model=Claim)
async def delete_claim_by_public_id(
    public_id: UUID, service: ClaimService = Depends(get_claim_service)
):
    try:
        claim = service.delete_claim_by_public_id(public_id)
        return claim
    except ClaimNotFoundToDeleteError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An unexpected error occurred: {e}",
        )


@claim_router.post("/claim/", response_model=Claim)
async def create_claim(
    claim: Claim, service: ClaimService = Depends(get_claim_service)
):
    try:
        new_claim = service.create_claim(claim)
        return new_claim
    except ClaimNotCreatedError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An unexpected error occurred: {e}",
        )


@claim_router.put("/claim/{public_id}", response_model=Claim)
async def update_claim_by_public_id(
    claim: Claim, public_id: UUID, service: ClaimService = Depends(get_claim_service)
):
    try:
        updated_claim = service.update_claim_by_public_id(claim, public_id)
        return updated_claim
    except ClaimNotUpdatedError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An unexpected error occurred: {e}",
        )
