from fastapi import FastAPI

from app.routers import profile

app = FastAPI(title="Example API")

app.include_router(profile.router)


@app.get("/api/health")
def health() -> dict[str, str]:
    return {"status": "ok"}
