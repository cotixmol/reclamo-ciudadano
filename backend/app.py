from fastapi import FastAPI
from routers.reports import router
import uvicorn

app = FastAPI(root_path="/api/v1")

app.include_router(router) 

if __name__ == "__main__":
    uvicorn.run(router, host="0.0.0.0", port=8000) 