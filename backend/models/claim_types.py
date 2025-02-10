from typing import Optional
from sqlmodel import SQLModel, Field
from sqlalchemy import Column, String


class ClaimTypes(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    category: str = Field(sa_column=Column(String, nullable=False))
    description: str = Field(sa_column=Column(String(1024), nullable=False))
