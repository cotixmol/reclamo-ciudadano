class ClaimTypesNotFoundError(Exception):
    """
    Raised when the list of claim Types is not found.
    """

    def __init__(self, message=None):
        if message is None:
            message = f"Claim Types not found in the database. All the claims will be set to ID 1"
        super().__init__(message)
