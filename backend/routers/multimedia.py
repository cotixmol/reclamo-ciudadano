from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from service import MultimediaService
from dependencies import validate_api_key_and_client
from errors import MultimediaNotCreatedError
from dependencies import get_multimedia_service
from models import Multimedia, MultimediaCreateRequest

multimedia_router = APIRouter(dependencies=[Depends(validate_api_key_and_client)])


@multimedia_router.post("/multimedia_metadata", response_model=List[Multimedia])
async def create_multimedia_metadata(
    metadata_list: List[MultimediaCreateRequest],
    service: MultimediaService = Depends(get_multimedia_service),
):
    """
    Create multiple Multimedia records from the provided metadata list.
    """
    try:
        new_records = service.create_multimedia_metadata(metadata_list)
        return new_records
    except MultimediaNotCreatedError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An unexpected error occurred: {e}",
        )
