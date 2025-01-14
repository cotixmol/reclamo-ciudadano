from datetime import datetime
from typing import Optional, Union
from sqlmodel import SQLModel, Field
from sqlalchemy import Column, String, DateTime, func, Integer, ForeignKey
from geoalchemy2 import Geometry
from custom_types import GeometryPoint


class Claim(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    type_category_id: Optional[int] = Field(
        sa_column=Column(Integer, ForeignKey("claimtypes.id"))
    )
    claim_location: Union[GeometryPoint, dict] = Field(
        sa_column=Column(
            Geometry(geometry_type="POINT", srid=4326, spatial_index=True),
            nullable=False,
        )
    )
    title: str = Field(sa_column=Column(String(255), nullable=False))
    description: str = Field(sa_column=Column(String(1024), nullable=False))
    status: str = Field(sa_column=Column(String(255), nullable=False))
    created_at: datetime = Field(
        sa_column=Column(DateTime(timezone=True), default=func.now(), nullable=False)
    )
    updated_at: datetime = Field(
        sa_column=Column(
            DateTime(timezone=True),
            default=func.now(),
            onupdate=func.now(),
            nullable=False,
        )
    )
