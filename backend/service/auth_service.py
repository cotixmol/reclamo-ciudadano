from repository import AuthRepository


class AuthService:
    def __init__(self, auth_repository: AuthRepository):
        self.auth_repository = auth_repository

    def validate_api_key_and_client(self, api_key: str, client_name: str):
        return self.auth_repository.validate_api_key_and_client(api_key, client_name)
