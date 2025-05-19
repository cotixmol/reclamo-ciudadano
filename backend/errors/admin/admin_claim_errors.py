class ClaimsNotFoundByClientError(Exception):
    """
    Raised when claims where not found for a specific client public ID.
    This typically occurs when the client with the given ID does not exist in the database.
    The user should verify the client ID and try again.
    """

    def __init__(self, client_id, message=None):
        if message is None:
            message = (
                f"[ADMIN ERROR]"
                f"Claims for client with id {client_id} could not be found."
                f"It may not exist in the database. Please verify."
                f"the claim ID and try again."
            )
        super().__init__(message)
