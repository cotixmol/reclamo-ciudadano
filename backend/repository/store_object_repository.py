import os
import urllib.parse
import mimetypes
from typing import Dict, Optional, List
import boto3
from datetime import datetime
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
        Initializes the StoreObjectRepository with the necessary S3 configurations.

        Reads configuration from parameters or environment variables, sets up the S3 client,
        and ensures that the specified bucket exists.
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
        Checks if the specified bucket exists. If not, attempts to create it.

        Uses head_bucket to check existence and create_bucket to create the bucket if needed.
        """
        try:
            self.s3_client.head_bucket(Bucket=self.bucket_name)
        except ClientError as e:
            error_code = int(e.response["Error"]["Code"])
            # If bucket not found (error 404), then create it.
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

    def generate_presigned_write_urls(
        self, claim: Claim, expiration: int = 60
    ) -> Dict[str, str]:
        """
        Generates presigned URLs for uploading multiple files.

        Iterates over the list of files in the claim, sanitizes filenames, checks MIME types,
        and then creates a presigned URL for each file using the put_object operation.

        :param claim: The claim object containing file information.
        :param expiration: Time in seconds for the presigned URL to remain valid.
        :return: A dictionary mapping file names to their presigned URLs.
        :raises ValueError: If a file has an unsupported MIME type.
        """
        allowed_mime_types = self._get_allowed_mime_types()
        now = datetime.now()
        month_name = now.strftime("%B")
        day = now.strftime("%d")

        try:
            urls = {}
            for file in claim.files:
                sanitized_file = self._sanitize_filename(file)
                object_name = (
                    f"claims/{month_name}/{day}/{claim.public_id}/{sanitized_file}"
                )

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
            raise Exception(f"Error generating presigned write URLs: {e}") from e

    def generate_presigned_read_url_for_claim(
        self, claim: Claim, expiration: int = 3600
    ) -> Claim:
        """
        Generates presigned read URLs for all multimedia items in a single Claim.

        For each multimedia entry, extracts the S3 object key from the stored URL and creates
        a presigned URL (using get_object) to provide temporary access. If the multimedia list
        is empty, the claim is returned unmodified.

        :param claim: The Claim object with multimedia entries.
        :param expiration: Time in seconds for the URL to remain valid.
        :return: The Claim object with each multimedia s3_url replaced by its presigned URL.
        """
        if not claim.multimedia:
            return claim

        for multimedia_item in claim.multimedia:
            key = self._extract_key_from_url(multimedia_item.s3_url)
            presigned_url = self.s3_client.generate_presigned_url(
                "get_object",
                Params={"Bucket": self.bucket_name, "Key": key},
                ExpiresIn=expiration,
            )
            multimedia_item.s3_url = presigned_url
        return claim

    def generate_presigned_read_urls(
        self, claims: List[Claim], expiration: int = 3600
    ) -> List[Claim]:
        """
        Generates presigned read URLs for each Claim in a list.

        Iterates over the provided claims and updates each one by generating presigned URLs
        for its multimedia items.

        :param claims: A list of Claim objects.
        :param expiration: Time in seconds for the URL to remain valid.
        :return: A list of Claim objects with updated multimedia URLs.
        """
        return [
            self.generate_presigned_read_url_for_claim(claim, expiration)
            for claim in claims
        ]

    # TODO: Improve decoding and encoding methods. This is awful.
    @staticmethod
    def _sanitize_filename(filename: str) -> str:
        """
        Sanitizes the filename to prevent security issues like path traversal.
        First decodes any existing encoding, then encodes the result.

        :param filename: The original filename.
        :return: The sanitized and URL-encoded filename.
        """
        # Get only the base name (strip any directory components)
        base = os.path.basename(filename)
        # Decode any percent-encoded sequences (to avoid double encoding)
        decoded = urllib.parse.unquote(base)
        # Encode the filename once to ensure it's URL-safe
        return urllib.parse.quote(decoded, safe="")

    @staticmethod
    def _get_allowed_mime_types() -> List[str]:
        """
        Returns a list of allowed MIME types for file uploads.

        This list includes common image and video MIME types.
        """
        return [
            "image/jpeg",
            "image/png",
            "image/gif",
            "image/webp",
            "video/mp4",
            "video/mpeg",
        ]

    @staticmethod
    def _is_allowed_mime_type(content_type: str, allowed_mime_types: List[str]) -> bool:
        """
        Checks if the provided content type is among the allowed MIME types.

        :param content_type: The MIME type to check.
        :param allowed_mime_types: A list of allowed MIME types.
        :return: True if the content type is allowed, False otherwise.
        """
        return content_type.lower() in allowed_mime_types

    def _extract_key_from_url(self, s3_url: str) -> str:
        """
        Extracts the S3 object key from the full S3 URL.

        Assumes the URL is formatted as:
        "http://minio.reputacion.digital:9000/{bucket_name}/claims/..."
        and removes the bucket name from the path.
        If the key appears double-encoded (evidenced by '%25'), it decodes it once
        to maintain the original, single-encoded value.

        :param s3_url: The stored S3 URL.
        :return: The properly unquoted S3 object key.
        """
        parsed = urllib.parse.urlparse(s3_url)
        path = parsed.path.lstrip("/")
        bucket_prefix = f"{self.bucket_name}/"
        if path.startswith(bucket_prefix):
            key = path[len(bucket_prefix) :]
        else:
            key = path
        # If the key contains '%25', it is likely double-encoded; unquote once.
        if "%25" in key:
            key = urllib.parse.unquote(key)
        return key
