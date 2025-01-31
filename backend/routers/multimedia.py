from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from sqlmodel import Session

from service import MultimediaService
from dependencies import get_multimedia_service
from models import Multimedia, MultimediaCreate

multimedia_router = APIRouter()


@multimedia_router.post("/multimedia_metadata", response_model=List[Multimedia])
async def create_multimedia_metadata(
    metadata_list: List[MultimediaCreate],
    service: MultimediaService = Depends(get_multimedia_service),
):
    """
    Create multiple Multimedia records from the provided metadata list.
    """
    try:
        new_records = service.create_multimedia_metadata(metadata_list)
        return new_records
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An unexpected error occurred: {e}",
        )
