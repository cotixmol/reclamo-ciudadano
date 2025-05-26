from fastapi import Header, Depends
from config.db import db_reporte_ciudadano
from dao.auth_dao import AuthDAO
from repository.auth_repository import AuthRepository
from service import AuthService


def get_auth_service() -> AuthService:
    auth_dao = AuthDAO()
    auth_repository = AuthRepository(db_reporte_ciudadano, auth_dao)
    return AuthService(auth_repository)


def validate_api_key_and_client(
    api_key: str = Header(..., alias="x-api-key"),
    client_name: str = Header(..., alias="x-client-name"),
    auth_service: AuthService = Depends(get_auth_service),
) -> int:
    return auth_service.validate_api_key_and_client(api_key, client_name)
