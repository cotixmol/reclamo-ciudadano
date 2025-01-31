from datetime import datetime
from typing import Optional
from sqlmodel import SQLModel, Field
from sqlalchemy import Column, String, Integer, DateTime, func
from sqlalchemy.dialects.postgresql import UUID


class Multimedia(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    claim_id: int = Field(foreign_key="claim.id")
    s3_url: str = Field(sa_column=Column(String, nullable=False))
    file_name: str = Field(sa_column=Column(String(255), nullable=False))
    file_type: str = Field(sa_column=Column(String(255), nullable=False))
    file_size: int = Field(sa_column=Column(Integer, nullable=False))
    uploaded_at: datetime = Field(
        sa_column=Column(DateTime(timezone=True), default=func.now(), nullable=False)
    )


class MultimediaCreate(SQLModel):
    claim_id: int
    s3_url: str
    file_name: str
    file_type: str
    file_size: int
