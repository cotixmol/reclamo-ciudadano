from uuid import UUID
from typing import List
from pydantic import BaseModel


class AllClaimsRequest(BaseModel):
    public_ids: List[UUID]
