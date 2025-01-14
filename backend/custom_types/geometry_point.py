from uuid import UUID
from typing import List
from pydantic import BaseModel


class GeometryPoint(BaseModel):
    type: str = "Point"
    coordinates: List[float | int]


class ClaimsRequest(BaseModel):
    public_ids: List[UUID]
