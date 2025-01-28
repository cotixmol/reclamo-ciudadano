from fastapi import APIRouter, Depends, HTTPException, status
from service import ClaimService, MinioService
from typing import Optional
from dependencies import get_claim_service, get_minio_service
from models import Claim, CreateClaimResponse
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
    claim_service: ClaimService = Depends(get_claim_service),
):
    try:
        all_claims = claim_service.read_all_claims_by_public_ids(request.public_ids)
        return all_claims
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An unexpected error occurred: {e}",
        )


@claim_router.get("/claim/{public_id}", response_model=Claim)
async def read_claim_by_public_id(
    public_id: UUID, claim_service: ClaimService = Depends(get_claim_service)
):
    try:
        claim = claim_service.read_claim_by_public_id(public_id)
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
    public_id: UUID, claim_service: ClaimService = Depends(get_claim_service)
):
    try:
        claim = claim_service.delete_claim_by_public_id(public_id)
        return claim
    except ClaimNotFoundToDeleteError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An unexpected error occurred: {e}",
        )


@claim_router.post("/claim/", response_model=CreateClaimResponse)
async def create_claim(
    claim: Claim,
    claim_service: ClaimService = Depends(get_claim_service),
    minio_service: MinioService = Depends(get_minio_service),
):
    try:
        new_claim = claim_service.create_claim(claim)
        url = minio_service.generate_presigned_urls(new_claim)
        return {
            "new_claim": new_claim,
            "presigned_url": url or "No presigned URL generated",
            "status": "pending",
        }
    except ClaimNotCreatedError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An unexpected error occurred: {e}",
        )


@claim_router.put("/claim/{public_id}", response_model=Claim)
async def update_claim_by_public_id(
    claim: Claim,
    public_id: UUID,
    claim_service: ClaimService = Depends(get_claim_service),
):
    try:
        updated_claim = claim_service.update_claim_by_public_id(claim, public_id)
        return updated_claim
    except ClaimNotUpdatedError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An unexpected error occurred: {e}",
        )
