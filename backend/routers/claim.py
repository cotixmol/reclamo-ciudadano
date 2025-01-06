from fastapi import APIRouter, Depends
from service import ClaimService
from dependencies import get_claim_service
from models import Claim
from typing import List

router = APIRouter()


@router.get("/claims/", response_model=List[Claim])
async def read_all_claims(
    service: ClaimService = Depends(get_claim_service),
):
    all_claims = service.read_all_claims()
    return all_claims
