from fastapi import APIRouter, Depends, HTTPException, status
from service import StoreObjectService
from typing import List
from dependencies import (
    get_store_object_service,
    validate_api_key_and_client,
)
from dependencies.admin import get_admin_claim_service
from models import (
    ReadClaimResponse,
    MultimediaRead,
)
from service.admin import AdminClaimService
from errors.admin import ClaimsNotFoundByClientError
from uuid import UUID


admin_claim_router = APIRouter(
    dependencies=[Depends(validate_api_key_and_client)], prefix="/admin"
)


@admin_claim_router.get(
    "/claim/{client_public_id}", response_model=List[ReadClaimResponse]
)
async def read_all_claims_by_client_id(
    client_public_id: UUID,
    admin_claim_service: AdminClaimService = Depends(get_admin_claim_service),
    store_object_service: StoreObjectService = Depends(get_store_object_service),
):
    try:
        claims = admin_claim_service.read_all_claims_by_client_id(client_public_id)
        updated_claims = store_object_service.generate_presigned_read_urls(claims)
        response = [
            ReadClaimResponse(
                claim=c,
                multimedia=[MultimediaRead.model_validate(m) for m in c.multimedia],
            )
            for c in updated_claims
        ]
        return response
    except ClaimsNotFoundByClientError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An unexpected error occurred: {e}",
        )
