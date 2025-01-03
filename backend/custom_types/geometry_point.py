from typing import List
from geoalchemy2.shape import to_shape
from pydantic import BaseModel


class GeometryPoint(BaseModel):
    type: str = "Point"
    coordinates: List[float]
