from fastapi import APIRouter, Depends, HTTPException, status
from service import ClaimService, StoreObjectService
from typing import Optional
from dependencies import (
    get_claim_service,
    get_store_object_service,
    validate_api_key_and_client,
)
from models import (
    Claim,
    CreateClaimResponse,
    ReadClaimResponse,
    MultimediaRead,
    Claim,
    ClaimCreateRequestSchema,
    ClaimUpdateRequestSchema,
)
from uuid import UUID
from typing import List
from custom_types import AllClaimsRequest
from errors.claim_errors import (
    ClaimNotFoundError,
    ClaimNotFoundToDeleteError,
    ClaimNotCreatedError,
    ClaimNotUpdatedError,
)
from config.db import db_reporte_ciudadano
from sqlmodel import Session
from fastapi import Depends, HTTPException, status
from utils import get_current_client
from models import Client


claim_router = APIRouter(dependencies=[Depends(validate_api_key_and_client)])


@claim_router.post("/claims/", response_model=List[ReadClaimResponse])
async def read_all_claims_by_public_ids(
    request: AllClaimsRequest,
    claim_service: ClaimService = Depends(get_claim_service),
    store_object_service: StoreObjectService = Depends(get_store_object_service),
):
    print("Requesting claims for client")
    try:
        claims = claim_service.read_all_claims_by_public_ids(request.public_ids)
        updated_claims = store_object_service.generate_presigned_read_urls(claims)
        return [
            ReadClaimResponse(
                claim=c,
                multimedia=[MultimediaRead.model_validate(m) for m in c.multimedia],
            )
            for c in updated_claims
        ]
    except Exception as e:
        print("Error getting claims")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An unexpected error occurred: {e}",
        )


@claim_router.get("/claim/{public_id}", response_model=ReadClaimResponse)
async def read_claim_by_public_id(
    public_id: UUID,
    claim_service: ClaimService = Depends(get_claim_service),
    store_object_service: StoreObjectService = Depends(get_store_object_service),
):
    try:
        claim = claim_service.read_claim_by_public_id(public_id)
        updated_claim = store_object_service.generate_presigned_read_url(claim)
        response = ReadClaimResponse(
            claim=updated_claim,
            multimedia=[
                MultimediaRead.model_validate(m) for m in updated_claim.multimedia
            ],
        )
        return response
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
    claim: ClaimCreateRequestSchema,
    session: Session = Depends(db_reporte_ciudadano.get_session),
    current_client: Client = Depends(get_current_client),
    claim_service: ClaimService = Depends(get_claim_service),
    store_object_service: StoreObjectService = Depends(get_store_object_service),
):
    try:
        with session.begin():
            new_claim = claim_service.create_claim(claim, current_client.id)
            url = store_object_service.generate_presigned_write_urls(new_claim)
        return {
            "new_claim": new_claim,
            "presigned_url": url or "No presigned URL generated",
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
    claim: ClaimUpdateRequestSchema,
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


@claim_router.post("/claim/{public_id}/failed", response_model=CreateClaimResponse)
async def update_claim_processing_state_to_failed(
    public_id: UUID,
    claim_service: ClaimService = Depends(get_claim_service),
):
    try:
        new_claim = claim_service.update_claim_processing_state_to_failed(public_id)
        return {
            "new_claim": new_claim,
        }
    except ClaimNotCreatedError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An unexpected error occurred: {e}",
        )


@claim_router.post("/claim/{public_id}/finished", response_model=CreateClaimResponse)
async def update_claim_processing_state_to_finished(
    public_id: UUID,
    claim_service: ClaimService = Depends(get_claim_service),
):
    try:
        new_claim = claim_service.update_claim_processing_state_to_finished(public_id)
        return {
            "new_claim": new_claim,
        }
    except ClaimNotCreatedError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An unexpected error occurred: {e}",
        )
