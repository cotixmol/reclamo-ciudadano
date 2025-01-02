from .multimedia import Multimedia
from datetime import datetime
from typing import Optional, List
from sqlmodel import SQLModel, Field, Relationship
from sqlalchemy import Column, String, DateTime, func
from geoalchemy2 import Geometry


class Report(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    location: str = Field(
        sa_column=Column(
            Geometry(geometry_type="POINT", srid=4326), nullable=False, index=True
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

    multimedia: List["Multimedia"] = Relationship(back_populates="report")
