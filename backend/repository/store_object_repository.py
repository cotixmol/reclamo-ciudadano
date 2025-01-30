import os
import urllib.parse
import mimetypes
from typing import Dict, Optional, List
import boto3
from botocore.exceptions import ClientError
from models import Claim


class StoreObjectRepository:
    def __init__(
        self,
        endpoint_url: Optional[str] = None,
        access_key: Optional[str] = None,
        secret_key: Optional[str] = None,
        bucket_name: Optional[str] = None,
        region_name: Optional[str] = "us-east-1",
        use_ssl: bool = False,
    ):
        """
        Initializes the StoreObjectRepository with the necessary configurations.
        """
        self.endpoint_url = endpoint_url or os.getenv("S3_URL")
        self.access_key = access_key or os.getenv("SECRET_S3_ACCESS_KEY")
        self.secret_key = secret_key or os.getenv("SECRET_S3_SECRET_KEY")
        self.bucket_name = bucket_name or os.getenv("S3_BUCKET")
        self.region_name = region_name

        if not all(
            [self.endpoint_url, self.access_key, self.secret_key, self.bucket_name]
        ):
            raise ValueError("S3 configuration is incomplete.")

        self.s3_client = boto3.client(
            "s3",
            endpoint_url=self.endpoint_url,
            aws_access_key_id=self.access_key,
            aws_secret_access_key=self.secret_key,
            region_name=self.region_name,
            config=boto3.session.Config(signature_version="s3v4"),
            use_ssl=use_ssl,
        )

        self._ensure_bucket_exists()

    def _ensure_bucket_exists(self):
        """
        Ensures that the specified bucket exists; creates it if it doesn't.
        """
        try:
            self.s3_client.head_bucket(Bucket=self.bucket_name)
        except ClientError as e:
            error_code = int(e.response["Error"]["Code"])
            if error_code == 404:
                try:
                    self.s3_client.create_bucket(
                        Bucket=self.bucket_name,
                        CreateBucketConfiguration=(
                            {"LocationConstraint": self.region_name}
                            if self.region_name
                            else {}
                        ),
                    )
                    print(f"Bucket '{self.bucket_name}' created successfully.")
                except ClientError as create_error:
                    raise RuntimeError(
                        f"Error creating bucket: {create_error}"
                    ) from create_error
            else:
                raise RuntimeError(f"Error checking bucket existence: {e}") from e

    def generate_presigned_urls(
        self, claim: Claim, expiration: int = 3600
    ) -> Dict[str, str]:
        """
        Generates presigned URLs for multiple files.

        :param claim: The claim object containing file information.
        :param expiration: Time in seconds for the presigned URL to remain valid.
        :return: A dictionary mapping file names to their presigned URLs.
        :raises ValueError: If a file has an unsupported MIME type.
        """
        allowed_mime_types = self._get_allowed_mime_types()

        try:
            urls = {}
            for file in claim.files:
                sanitized_file = self._sanitize_filename(file)
                object_name = f"claims/{claim.public_id}/{sanitized_file}"

                content_type, _ = mimetypes.guess_type(sanitized_file)

                if not self._is_allowed_mime_type(content_type, allowed_mime_types):
                    raise ValueError(
                        f"Unsupported file type for '{file}'. Allowed types are images and videos."
                    )

                url = self.s3_client.generate_presigned_url(
                    "put_object",
                    Params={
                        "Bucket": self.bucket_name,
                        "Key": object_name,
                        "ContentType": content_type,
                    },
                    ExpiresIn=expiration,
                )

                urls[file] = url
            return urls
        except Exception as e:
            raise Exception(f"Error generating presigned URLs: {e}") from e

    @staticmethod
    def _sanitize_filename(filename: str) -> str:
        """
        Sanitizes the filename to prevent security issues like path traversal.

        :param filename: The original filename.
        :return: The sanitized and URL-encoded filename.
        """
        sanitized = os.path.basename(filename)
        return urllib.parse.quote(sanitized, safe="")

    @staticmethod
    def _get_allowed_mime_types() -> List[str]:
        return [
            # Images
            "image/jpeg",
            "image/png",
            "image/gif",
            "image/webp",
            # Videos
            "video/mp4",
            "video/mpeg",
        ]

    @staticmethod
    def _is_allowed_mime_type(content_type: str, allowed_mime_types: List[str]) -> bool:
        return content_type.lower() in allowed_mime_types
