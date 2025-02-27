from enum import Enum


class ApiKeyRole(str, Enum):
    client = "client"
    admin = "admin"
    superadmin = "superadmin"
