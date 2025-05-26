from fastapi import APIRouter, Depends, status
from models.admin import LoginIn, TokenOut
from dependencies import validate_api_key_and_client
from dependencies.admin import get_admin_auth_service
from service.admin import AdminAuthService

admin_auth_router = APIRouter(prefix="/admin", tags=["admin-auth"])


@admin_auth_router.post(
    "/login", response_model=TokenOut, status_code=status.HTTP_200_OK
)
async def admin_login(
    request: LoginIn,
    client_id: int = Depends(validate_api_key_and_client),
    admin_auth_service: AdminAuthService = Depends(get_admin_auth_service),
):
    token = admin_auth_service.login(client_id, request.email, request.password)
    return {"token": token}
