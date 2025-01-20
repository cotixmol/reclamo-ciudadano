from fastapi import FastAPI
from routers import claim_router, claim_types_router
import uvicorn
from middleware.cors import add_cors_middleware

app = FastAPI()
add_cors_middleware(app)
app.include_router(claim_router, prefix="/api/v1")
app.include_router(claim_types_router, prefix="/api/v1")


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
