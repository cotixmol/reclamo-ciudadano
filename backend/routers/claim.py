from fastapi import APIRouter, Depends, HTTPException, status
from service import ClaimService
from dependencies import get_claim_service
from models import Claim
from typing import List
from errors.claim_errors import ClaimNotFound, ClaimsNotFound, ClaimNotFoundToDelete

router = APIRouter()


@router.get("/claims/", response_model=List[Claim])
async def read_all_claims(
    service: ClaimService = Depends(get_claim_service),
):
    try:
        all_claims = service.read_all_claims()
        return all_claims
    except ClaimsNotFound as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An unexpected error occurred: {e}",
        )


@router.get("/claims/{claim_id}", response_model=Claim)
async def read_claim_by_id(
    claim_id: int, service: ClaimService = Depends(get_claim_service)
):
    try:
        claim = service.read_claim_by_id(claim_id)
        return claim
    except ClaimNotFound as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An unexpected error occurred: {e}",
        )


@router.delete("/claims/{claim_id}", response_model=Claim)
async def delete_claim_by_id(
    claim_id: int, service: ClaimService = Depends(get_claim_service)
):
    try:
        claim = service.delete_claim_by_id(claim_id)
        return claim
    except ClaimNotFoundToDelete as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An unexpected error occurred: {e}",
        )
