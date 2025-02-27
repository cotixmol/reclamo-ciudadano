from typing import Optional, TYPE_CHECKING
from datetime import datetime
from sqlmodel import SQLModel, Field, Relationship
from sqlalchemy import (
    Column,
    String,
    DateTime,
    func,
    Boolean,
    text,
    ForeignKey,
    Enum as SQLAlchemyEnum,
)
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from custom_types import ApiKeyRole


if TYPE_CHECKING:
    from .clients import Client


class ApiKey(SQLModel, table=True):
    __tablename__ = "api_keys"

    id: Optional[int] = Field(default=None, primary_key=True)
    client_id: int = Field(sa_column=Column(ForeignKey("clients.id"), nullable=False))
    key: str = Field(sa_column=Column(String, unique=True, index=True, nullable=False))
    created_at: datetime = Field(
        sa_column=Column(
            DateTime(timezone=True), server_default=func.now(), nullable=False
        )
    )
    updated_at: datetime = Field(
        sa_column=Column(
            DateTime(timezone=True),
            server_default=func.now(),
            onupdate=func.now(),
            nullable=False,
        )
    )
    active: bool = Field(
        default=True,
        sa_column=Column(Boolean, nullable=False, server_default=text("true")),
    )
    role: ApiKeyRole = Field(
        sa_column=Column(
            SQLAlchemyEnum(ApiKeyRole), nullable=False, server_default=ApiKeyRole.client
        )
    )

    client: Optional["Client"] = Relationship(back_populates="api_keys")
