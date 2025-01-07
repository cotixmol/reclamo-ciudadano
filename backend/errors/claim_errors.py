class ClaimsNotFoundError(Exception):
    """
    Raised when no claims are found in the database.
    """

    def __init__(
        self,
        message=None,
        errors=None,
    ):
        if message is None:
            message = f"No claims found in the database. Please check your search criteria or ensure that claims have been submitted: {errors}"
        super().__init__(message)


class ClaimNotFoundError(Exception):
    """
    Raised when a specific claim is not found.
    """

    def __init__(self, claim_id, message=None):
        if message is None:
            message = f"Claim with id {claim_id} not found in the database. Please verify the claim ID and try again."
        super().__init__(message)


class ClaimNotFoundToDeleteError(Exception):
    """
    Raised when a specific claim is not found to delete.
    """

    def __init__(self, claim_id, message=None, errors=None):
        if message is None:
            message = f"Could not delete claim with id {claim_id} because it is not found in the database. Please verify the claim ID and try again: {errors}"
        super().__init__(message)


class ClaimNotCreatedError(Exception):
    """
    Raised when a claim is not created.
    """

    def __init__(self, message=None, errors=None):
        if message is None:
            message = f"Could not create a claim. Please verify the claim object and try again: {errors}"
        super().__init__(message)


class ClaimNotConvertedError(Exception):
    """
    Raised when a claim is not converted.
    """

    def __init__(self, message=None, errors=None):
        if message is None:
            message = f"Could not convert a claim. Please verify the claim object and try again: {errors}"
        super().__init__(message)


class ClaimNotUpdatedError(Exception):
    """
    Raised when a claim is not updated.
    """

    def __init__(self, message=None, errors=None):
        if message is None:
            message = f"Could not update a claim. Please verify the claim object and try again: {errors}"
        super().__init__(message)
