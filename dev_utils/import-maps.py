import os
from dotenv import load_dotenv
from urllib.parse import urlparse
import subprocess
import logging

load_dotenv()

logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s"
)

database_url = os.getenv("DATABASE_URL")
if not database_url:
    logging.error("DATABASE_URL is not set.")
    raise ValueError("DATABASE_URL is not set.")

parsed = urlparse(database_url)
user = parsed.username
password = parsed.password
host = parsed.hostname or "localhost"
port = parsed.port or "5432"
dbname = parsed.path.lstrip("/")

os.environ["PGPASSWORD"] = password
os.environ["PGUSER"] = user

command = [
    "osm2pgsql",
    "--create",
    "--database",
    dbname,
    "--host",
    host,
    "--port",
    str(port),
    "./dev_utils/south-america-latest.osm.pbf",
    "./dev_utils/mexico-latest.osm.pbf",
    "./dev_utils/central-america-latest.osm.pbf",
]

confirm = input("This will start the osm2pgsql import. Type 'yes' to proceed: ")
if confirm.lower() != "yes":
    logging.info("Import aborted by user.")
    exit(0)

logging.info("Starting osm2pgsql import...")

process = subprocess.Popen(
    command, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True
)

while True:
    output = process.stdout.readline()
    if output == "" and process.poll() is not None:
        break
    if output:
        logging.info(output.strip())

return_code = process.poll()
if return_code == 0:
    logging.info("osm2pgsql import completed successfully.")
else:
    logging.error("osm2pgsql import failed with return code: %s", return_code)
