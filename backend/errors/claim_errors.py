class ClaimNotFoundError(Exception):
    """
    Raised when a specific claim cannot be found or may have been logically deleted.
    This typically occurs when the claim with the given ID does not exist in the database
    or was already marked as deleted. The user should verify the claim ID and try again.
    """

    def __init__(self, claim_id, message=None):
        if message is None:
            message = (
                f"Claim with id {claim_id} could not be found. It may be "
                f"deleted or does not exist in the database. Please verify "
                f"the claim ID and try again."
            )
        super().__init__(message)


class ClaimNotFoundToDeleteError(Exception):
    """
    Raised when an attempt to delete a specific claim fails because it
    cannot be found or may have already been logically deleted.
    The user should verify the claim ID and try again.
    """

    def __init__(self, claim_id, message=None, errors=None):
        if message is None:
            message = (
                f"Could not delete claim with id {claim_id}. It was already "
                f"deleted or does not exist in the database. Please verify "
                f"the claim ID and try again. Details: {errors}"
            )
        super().__init__(message)


class ClaimNotCreatedError(Exception):
    """
    Raised when a new claim cannot be created.
    This usually indicates an error in the claim data itself
    or a database-related issue.
    """

    def __init__(self, message=None, errors=None):
        if message is None:
            message = (
                f"Could not create a claim. Please verify the claim data and "
                f"try again. Details: {errors}"
            )
        super().__init__(message)


class ClaimNotConvertedError(Exception):
    """
    Raised when a claim or its geometry cannot be converted properly.
    This typically indicates an issue with the spatial data format.
    """

    def __init__(self, message=None, errors=None):
        if message is None:
            message = (
                f"Could not convert the claim data. Please verify the spatial "
                f"data (geometry) and try again. Details: {errors}"
            )
        super().__init__(message)


class ClaimNotUpdatedError(Exception):
    """
    Raised when a claim cannot be updated, often because it cannot be found
    or may have been logically deleted. Verify the claim ID or data and try again.
    """

    def __init__(self, message=None, errors=None):
        if message is None:
            message = (
                f"Could not update the claim. It may be deleted or not exist "
                f"in the database. Please verify the claim ID/data and try "
                f"again. Details: {errors}"
            )
        super().__init__(message)
