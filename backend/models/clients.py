from datetime import datetime
from typing import Optional, List, TYPE_CHECKING
from sqlmodel import SQLModel, Field, Relationship
from sqlalchemy import Column, DateTime, func, Boolean, text
from uuid import UUID, uuid4
from sqlalchemy.dialects.postgresql import UUID as PG_UUID

if TYPE_CHECKING:
    from .api_key import ApiKey
    from .admin import AdminUser


class Client(SQLModel, table=True):
    __tablename__ = "clients"

    id: Optional[int] = Field(default=None, primary_key=True)
    public_id: UUID = Field(
        sa_column=Column(
            PG_UUID(as_uuid=True),
            unique=True,
            index=True,
            nullable=False,
        ),
        default_factory=uuid4,
    )
    name: str = Field(nullable=False, index=True)

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
    deleted: bool = Field(
        default=False,
        sa_column=Column(Boolean, nullable=False, server_default=text("false")),
    )

    api_keys: List["ApiKey"] = Relationship(back_populates="client")
    users: list["AdminUser"] = Relationship(back_populates="client")
