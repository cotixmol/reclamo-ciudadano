from fastapi.middleware.cors import CORSMiddleware


def add_cors_middleware(app):
    """Add CORS middleware to the FastAPI app."""

    origins = [
        "http://localhost:3000",  # Replace with your Next.js frontend's origin
    ]

    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,  # If you need to send cookies, set this to True
        allow_methods=["*"],  # Allow all methods (GET, POST, PUT, DELETE, etc.)
        allow_headers=["*"],  # Allow all headers
    )
