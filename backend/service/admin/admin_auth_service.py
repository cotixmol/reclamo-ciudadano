import os
from datetime import datetime, timedelta, timezone
from jose import jwt
from repository.admin import AdminUserRepository

JWT_SECRET = os.getenv("JWT_SECRET")
JWT_EXPIRY_MIN = int(os.getenv("JWT_EXPIRY_MIN"))


class AdminAuthService:
    def __init__(self, admin_user_repository: AdminUserRepository):
        self.admin_user_repository = admin_user_repository

    def login(self, client_id: int, email: str, password: str) -> str:
        user = self.admin_user_repository.authenticate(client_id, email, password)
        payload = {
            "sub": str(user.public_id),
            "client": client_id,
            "role": "admin",
            "exp": datetime.now(timezone.utc) + timedelta(minutes=JWT_EXPIRY_MIN),
        }
        return jwt.encode(payload, JWT_SECRET, algorithm="HS256")
