from datetime import datetime
from typing import Optional, List
from sqlmodel import SQLModel, Field, Relationship
from sqlalchemy import Column, String, DateTime, func
from geoalchemy2 import Geometry
from custom_types import GeometryPoint


class Report(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    report_location: GeometryPoint = Field(
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
