from uuid import UUID
from typing import List
from pydantic import BaseModel
from enum import Enum


class AllClaimsRequest(BaseModel):
    public_ids: List[UUID]


class ClaimProcessingStateEnum(str, Enum):
    DRAFT = "DRAFT"  # Claim created, waiting for file upload
    FINISHED = "FINISHED"  # Fully created, files uploaded, and metadata saved
    FAILED = "FAILED"  # Something went wrong (e.g., upload failed)
