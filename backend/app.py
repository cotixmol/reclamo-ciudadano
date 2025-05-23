from fastapi import FastAPI
from routers import (
    claim_router,
    claim_types_router,
    multimedia_router,
    admin_claim_router,
    admin_auth_router,
)

import uvicorn
from middleware.cors import add_cors_middleware

app = FastAPI()
prefix = "/api/v1"
add_cors_middleware(app)
app.include_router(claim_router, prefix=prefix)
app.include_router(claim_types_router, prefix=prefix)
app.include_router(multimedia_router, prefix=prefix)
app.include_router(admin_claim_router, prefix=prefix)
app.include_router(admin_auth_router, prefix=prefix)


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
