from fastapi import APIRouter, Depends, HTTPException, status
from service import ClaimTypesService
from dependencies import validate_api_key_and_client
from dependencies import get_claim_types_service
from models import ClaimTypes
from typing import List
from errors import ClaimTypesNotFoundError

claim_types_router = APIRouter(dependencies=[Depends(validate_api_key_and_client)])


@claim_types_router.get("/claim_types", response_model=List[ClaimTypes])
async def load_all_claims_types_at_bootstart(
    service: ClaimTypesService = Depends(get_claim_types_service),
):
    try:
        claim = service.load_all_claims_types_at_bootstart()
        return claim
    except ClaimTypesNotFoundError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An unexpected error occurred: {e}",
        )
