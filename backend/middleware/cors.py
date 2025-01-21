from fastapi.middleware.cors import CORSMiddleware


def add_cors_middleware(app):
    """Add CORS middleware to the FastAPI app."""

    origins = [
        "http://localhost:3000",
        "http://dev.reclamo-ciudadano.reputacion.digital:3007",
        "https://dev.reclamo-ciudadano.reputacion.digital",
        "http://190.2.8.138:3007",
        "https://190.2.8.138",
    ]

    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
