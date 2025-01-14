import os
from dotenv import load_dotenv

load_dotenv()
from abc import ABC, abstractmethod
from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine
from sqlmodel import Session
from typing import Generator


class DatabaseReporteCiudadano(ABC):
    """
    Abstract class to handle the connection to the database.
    """

    @abstractmethod
    def get_session(self) -> Session:
        """
        Returns a session from the database.
        """
        pass

    @abstractmethod
    def get_session_generator(self) -> Generator[Session, None, None]:
        """
        Generator to use the session in context (should handle automatic database closing).
        """
        pass


class SQLAlchemyReporteCiudadano(DatabaseReporteCiudadano):
    """Concrete implementation of DatabaseManager using SQLAlchemy."""

    def __init__(self, database_url: str):
        self.url = database_url
        if not self.url:
            raise ValueError("DATABASE_URL environment variable not set.")
        engine = create_engine(self.url)
        self.SessionLocal = sessionmaker(bind=engine, class_=Session)

    def get_session(self) -> Session:
        return self.SessionLocal()

    def get_session_generator(self) -> Generator[Session, None, None]:
        db = self.get_session()
        try:
            yield db
        finally:
            db.close()


db_reporte_ciudadano: SQLAlchemyReporteCiudadano = SQLAlchemyReporteCiudadano(
    database_url=os.getenv("DATABASE_URL")
)
