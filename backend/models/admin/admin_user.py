from datetime import datetime
from uuid import uuid4
from pydantic import BaseModel, EmailStr
from typing import TYPE_CHECKING
from sqlmodel import SQLModel, Field, Relationship, Column
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlalchemy import String, DateTime, func, ForeignKey, UniqueConstraint
from passlib.hash import bcrypt
from pydantic import ConfigDict

if TYPE_CHECKING:
    from models import Client


class LoginIn(BaseModel):
    email: EmailStr
    password: str


class TokenOut(BaseModel):
    token: str


class AdminUser(SQLModel, table=True):
    __tablename__ = "admin_users"
    __table_args__ = (
        UniqueConstraint("client_id", "email", name="uq_user_email_per_client"),
    )
    model_config = ConfigDict(arbitrary_types_allowed=True)  # pydantic v2+

    id: int | None = Field(default=None, primary_key=True)
    public_id: PG_UUID = Field(
        sa_column=Column(PG_UUID(as_uuid=True), default=uuid4, unique=True)
    )
    client_id: int = Field(sa_column=Column(ForeignKey("clients.id"), nullable=False))
    email: str = Field(sa_column=Column(String, nullable=False))
    hashed_password: str = Field(sa_column=Column(String, nullable=False))
    created_at: datetime | None = Field(
        sa_column=Column(DateTime(timezone=True), server_default=func.now())
    )

    # convenience helpers
    @staticmethod
    def hash_pw(pw: str) -> str:
        return bcrypt.hash(pw)

    def verify_pw(self, plain: str) -> bool:
        return bcrypt.verify(plain, self.hashed_password)

    client: "Client" = Relationship(back_populates="users")
