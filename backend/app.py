from fastapi import FastAPI
from routers.claim import router
import uvicorn
from middleware.cors import add_cors_middleware

app = FastAPI(root_path="/api/v1")

add_cors_middleware(app)

app.include_router(router)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
