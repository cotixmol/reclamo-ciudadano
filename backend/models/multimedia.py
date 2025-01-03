from datetime import datetime
from .report import Report
from typing import Optional
from sqlmodel import SQLModel, Field, Relationship
from sqlalchemy import Column, String, Integer, DateTime, func
from sqlalchemy.dialects.postgresql import UUID


class Multimedia(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    report_id: int = Field(foreign_key="report.id")
    s3_url: str = Field(sa_column=Column(String, nullable=False))
    file_name: str = Field(sa_column=Column(String(255), nullable=False))
    file_type: str = Field(sa_column=Column(String(255), nullable=False))
    file_size: int = Field(sa_column=Column(Integer, nullable=False))
    uploaded_at: datetime = Field(
        sa_column=Column(DateTime(timezone=True), default=func.now(), nullable=False)
    )
