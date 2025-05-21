import uuid
from sqlalchemy import Index
from typing import Optional, Union, List, TYPE_CHECKING
from uuid import UUID
from pydantic import BaseModel
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
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
    ARRAY,
)
from pydantic import PrivateAttr
from typing import Dict, Optional
from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime
from geoalchemy2 import Geometry
from custom_types import GeometryPoint, PriorityEnum, ClaimProcessingStateEnum
from models import MultimediaRead

if TYPE_CHECKING:
    from models import Multimedia
    from models import Client


class ClaimCreateRequestSchema(BaseModel):
    title: str
    description: str
    type_category_id: Optional[int]
    status: str  # TODO: Add enums
    claim_location: Union[GeometryPoint, dict]
    address: str  # New field added
    priority: str  # TODO: Add enums
    files: List[str]
    file_sizes: Optional[Dict[str, int]] = None

    class Config:
        from_attributes = True


class ClaimUpdateRequestSchema(BaseModel):
    title: Optional[str] = None
    type_category_id: Optional[int] = None
    description: Optional[str] = None
    status: Optional[str] = None
    claim_location: Optional[Union[GeometryPoint, dict]] = None
    address: Optional[str] = None
    priority: Optional[str] = None

    class Config:
        from_attributes = True


class Claim(SQLModel, table=True):
    __tablename__ = "claim"

    # Explicitly define the GiST index in table args
    __table_args__ = (
        Index("idx_claim_location", "claim_location", postgresql_using="gist"),
    )

    id: Optional[int] = Field(default=None, primary_key=True)
    public_id: UUID = Field(
        sa_column=Column(
            PG_UUID(as_uuid=True),
            unique=True,
            index=True,
            nullable=False,
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
    address: str = Field(sa_column=Column(String(255), nullable=True))
    title: str = Field(sa_column=Column(String(255), nullable=False))
    description: str = Field(sa_column=Column(String(1024), nullable=False))
    status: str = Field(sa_column=Column(String(255), nullable=False))
    processing_state: ClaimProcessingStateEnum = Field(
        sa_column=Column(
            SQLAlchemyEnum(
                ClaimProcessingStateEnum, name="claim_processing_state_enum"
            ),
            nullable=False,
            server_default=ClaimProcessingStateEnum.DRAFT,
        ),
        default=ClaimProcessingStateEnum.DRAFT,
    )
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
    files: List[str] = Field(
        default_factory=list,
        sa_column=Column(ARRAY(String), nullable=True),
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
    client_id: int = Field(
        sa_column=Column(ForeignKey("clients.id"), nullable=False, index=True)
    )
    client: Optional["Client"] = Relationship()
    multimedia: List["Multimedia"] = Relationship()
    _file_sizes: Optional[Dict[str, int]] = PrivateAttr(default=None)

    @property
    def file_sizes(self) -> Optional[Dict[str, int]]:
        return self._file_sizes

    @file_sizes.setter
    def file_sizes(self, value: Optional[Dict[str, int]]) -> None:
        self._file_sizes = value


class CreateClaimResponse(BaseModel):
    new_claim: Claim
    presigned_url: Optional[object] = None

    class Config:
        from_attributes = True


class ReadClaimResponse(BaseModel):
    claim: Claim
    multimedia: List[MultimediaRead] = []

    class Config:
        from_attributes = True
