# Use the official Python 3.13 slim image
FROM python:3.13-slim

# Install dependencies 
WORKDIR /app
RUN apt-get update && apt-get install -y gcc libpq-dev
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the entire app code into the container
COPY . .

# Expose the port your app runs on (FastAPI default is 8000)
EXPOSE 8000

# Ensure the app reads the .env file
ENV PYTHONUNBUFFERED=1

# Command to run the FastAPI app
CMD ["python3", "app.py"]
