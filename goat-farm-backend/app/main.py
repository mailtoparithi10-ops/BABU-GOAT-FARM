import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from .database import engine, Base, SessionLocal
from .init_admin import create_initial_admin

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
    # Create Database Tables
    Base.metadata.create_all(bind=engine)
    
    # Bootstrap Initial Admin User from Config
    db = SessionLocal()
    try:
        create_initial_admin(db)
    finally:
        db.close()
        
    yield
    # Cleanup logic (if any) runs after application exit

app = FastAPI(
    title="Babu Goat Farm Management API",
    description="Meat Goat Farm Management System for Babu Goat Farm",
    version="1.0.0",
    lifespan=lifespan
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, replace with specific origins
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
    return {"message": "Welcome to Babu Goat Farm Management System API"}

# For rendering deployment / production usage
if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)