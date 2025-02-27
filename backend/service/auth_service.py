from repository import AuthRepository


class AuthService:
    def __init__(self, repository: AuthRepository):
        self.repository = repository

    def validate_api_key_and_client(self, api_key: str, client_name: str):
        return self.repository.validate_api_key_and_client(api_key, client_name)
