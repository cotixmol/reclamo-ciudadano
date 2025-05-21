import unicodedata
from sqlmodel import Session
from models import ApiKey  # ApiKey model includes a relationship to Client
from dao.auth_dao import AuthDAO
from fastapi import HTTPException, status


class AuthRepository:
    def __init__(self, db_reporte_ciudadano: Session, auth_dao: AuthDAO):
        self.db_reporte_ciudadano = db_reporte_ciudadano
        self.auth_dao = auth_dao

    def __normalize_text(self, text: str) -> str:
        # Try a simple re-encoding from latin1 to utf-8.
        try:
            text = text.encode("latin1").decode("utf-8")
        except Exception:
            pass
        return unicodedata.normalize("NFC", text)

    def validate_api_key_and_client(self, api_key: str, client_name: str) -> int:
        for db in self.db_reporte_ciudadano.get_session_generator():
            api_key_record = self.auth_dao.get_api_key(db, api_key)
            if not api_key_record:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN, detail="Forbidden"
                )

            fixed_client_name = self.__normalize_text(client_name)
            fixed_db_name = self.__normalize_text(api_key_record.client.name)

            if fixed_db_name != fixed_client_name:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN, detail="Forbidden"
                )

            return api_key_record.client_id
