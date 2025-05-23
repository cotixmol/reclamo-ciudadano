from fastapi import APIRouter, Depends, status
from models.admin import LoginIn, TokenOut
from dependencies import validate_api_key_and_client
from dependencies.admin import get_admin_auth_service
from service.admin import AdminAuthService

router = APIRouter(prefix="/admin/auth", tags=["admin-auth"])


@router.post("/login", response_model=TokenOut, status_code=status.HTTP_200_OK)
async def admin_login(
    payload: LoginIn,
    client_id: int = Depends(validate_api_key_and_client),
    admin_auth_service: AdminAuthService = Depends(get_admin_auth_service),
):
    token = admin_auth_service.login(client_id, payload.email, payload.password)
    return {"token": token}
