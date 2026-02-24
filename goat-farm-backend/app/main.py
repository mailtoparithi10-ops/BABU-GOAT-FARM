import uvicorn
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from .database import engine, Base, SessionLocal
from .init_admin import create_initial_admin
from .config import settings

from .routers import (
    auth_router,
    goats_router,
    inventory_router,
    expenses_router,
    sales_router,
    dashboard_router
)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create Database Tables on startup
    Base.metadata.create_all(bind=engine)
    
    # Bootstrap Initial Admin User from Config
    db = SessionLocal()
    try:
        create_initial_admin(db)
    finally:
        db.close()
        
    yield

IS_PRODUCTION = os.getenv("VERCEL", False) or os.getenv("PRODUCTION", False)

app = FastAPI(
    title="Babu Goat Farm Management API",
    description="Meat Goat Farm Management System for Babu Goat Farm",
    version="1.0.0",
    lifespan=lifespan,
    # Disable docs in production for security
    docs_url=None if IS_PRODUCTION else "/docs",
    redoc_url=None if IS_PRODUCTION else "/redoc",
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register Routers
app.include_router(auth_router.router)
app.include_router(goats_router.router)
app.include_router(inventory_router.router)
app.include_router(expenses_router.router)
app.include_router(sales_router.router)
app.include_router(dashboard_router.router)

@app.get("/")
def read_root():
    return {"message": "Babu Goat Farm API is running", "version": "1.0.0"}

# For local development only
if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)