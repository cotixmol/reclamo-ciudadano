import uuid
from pydantic import BaseModel
from uuid import UUID
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from datetime import datetime
from typing import Optional, Union
from sqlmodel import SQLModel, Field
from sqlalchemy import (
    Column,
    String,
    DateTime,
    func,
    Integer,
    ForeignKey,
    Boolean,
    text,
    Enum as SQLAlchemyEnum,
)
from geoalchemy2 import Geometry
from custom_types import GeometryPoint, PriorityEnum


class Claim(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    public_id: UUID = Field(
        sa_column=Column(
            PG_UUID(as_uuid=True), unique=True, index=True, nullable=False
        ),
        default_factory=uuid.uuid4,
    )
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
    priority: PriorityEnum = Field(
        sa_column=Column(
            SQLAlchemyEnum(PriorityEnum, name="priority_enum"),
            nullable=False,
            server_default="LOW",
        ),
        default=PriorityEnum.LOW,
    )
    has_multimedia: bool = Field(
        default=False,
        sa_column=Column(
            Boolean,
            nullable=False,
            server_default=text("false"),
        ),
    )
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
    deleted_at: Optional[datetime] = Field(
        sa_column=Column(DateTime(timezone=True), nullable=True)
    )
    deleted: bool = Field(
        default=False,
        sa_column=Column(
            Boolean,
            nullable=False,
            server_default=text("false"),
        ),
    )


class CreateClaimResponse(BaseModel):
    new_claim: Claim
    presigned_url: Optional[str] = None
    status: str

    class Config:
        from_attributes = True
