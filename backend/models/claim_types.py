from typing import Optional
from sqlmodel import SQLModel, Field
from sqlalchemy import Column, String


class ClaimTypes(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    category_en: str = Field(sa_column=Column(String, nullable=False))
    description_en: str = Field(sa_column=Column(String(1024), nullable=False))
    category_es: str = Field(sa_column=Column(String, nullable=True))
    description_es: str = Field(sa_column=Column(String(1024), nullable=True))
