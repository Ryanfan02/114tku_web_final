from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.db import ensure_indexes
from app.routers.auth import router as auth_router
from app.routers.events import router as events_router

app = FastAPI(title="List Planner API")

origins = []
for x in settings.CORS_ORIGINS.split(","):
    x2 = x.strip()
    if x2:
        origins.append(x2)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(events_router)


@app.on_event("startup")
async def startup():
    await ensure_indexes()


@app.get("/")
async def root():
    return {"ok": True, "name": "List Planner API"}


