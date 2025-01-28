import os
from minio import Minio
from minio.error import S3Error
from models import Claim
from typing import Optional


import os
from minio import Minio


class MinioRepository:
    def __init__(self):
        self.client = Minio(
            endpoint=os.environ.get("MINIO_URL"),
            access_key=os.environ.get("SECRET_MINIO_ACCESS_KEY"),
            secret_key=os.environ.get("SECRET_MINIO_SECRET_KEY"),
            secure=False,
        )
        self.bucket_name = os.environ.get("MINIO_BUCKET")

        if not self.client.bucket_exists(self.bucket_name):
            self.client.make_bucket(self.bucket_name)

    def generate_presigned_url(
        self, claim: Claim, expiration: int = 3600
    ) -> Optional[str]:
        """
        Generates a presigned URL for a specific object related to the claim.

        :param claim: The Claim object containing necessary information.
        :param expiration: Time in seconds for the URL to remain valid.
        :return: Presigned URL as a string or None if an error occurs.
        """
        try:
            object_name = f"claims/{claim.id}/document.pdf"  # Example object path
            # Generate presigned URL for GET operation
            url = self.client.presigned_get_object(
                self.bucket_name, object_name, expires=expiration
            )
            return url
        except S3Error as e:
            # Log the error as needed
            print(f"Error generating presigned URL: {e}")
            return None
