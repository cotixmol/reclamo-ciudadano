class MultimediaNotCreatedError(Exception):
    """
    Raised when a multimedia file or entry cannot be created.
    This usually indicates an error in the provided data,
    a storage issue, or a database-related problem.
    """

    def __init__(self, message=None, errors=None):
        if message is None:
            message = (
                f"Could not create the multimedia file or entry. Please verify the "
                f"provided data and try again. Details: {errors}"
            )
        super().__init__(message)


class MultimediaNotFoundError(Exception):
    """
    Raised when a specific multimedia file or entry cannot be found.
    This typically occurs when the multimedia item with the given ID
    does not exist in the database or was already deleted.
    """

    def __init__(self, multimedia_id, message=None):
        if message is None:
            message = (
                f"Multimedia file with ID {multimedia_id} could not be found. It may "
                f"be deleted or does not exist in the database. Please verify "
                f"the multimedia ID and try again."
            )
        super().__init__(message)
