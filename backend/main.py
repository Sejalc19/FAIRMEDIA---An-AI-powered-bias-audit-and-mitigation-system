"""
Main FastAPI application.
Entry point for the FAIRMEDIA backend server.
"""

import sys
from pathlib import Path

# Add project root to Python path
project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.routes import analyze
from backend.config import settings
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

logger = logging.getLogger(__name__)

# Create FastAPI app
app = FastAPI(
    title="FAIRMEDIA Bias Audit API",
    description="AI-powered bias detection and mitigation system",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(analyze.router, prefix="/api/v1", tags=["analysis"])


@app.get("/")
async def root():
    """Root endpoint with API information."""
    return {
        "message": "FAIRMEDIA Bias Audit API",
        "version": "1.0.0",
        "docs": "/docs",
        "health": "/health"
    }


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "service": "fairmedia-backend",
        "version": "1.0.0",
        "storage_mode": settings.STORAGE_MODE,
        "python_path": str(project_root)
    }


@app.on_event("startup")
async def startup_event():
    """Startup event handler."""
    logger.info("🚀 FAIRMEDIA Backend starting up...")
    logger.info(f"📦 Storage mode: {settings.STORAGE_MODE}")
    logger.info(f"🤖 AI Service: {settings.AI_SERVICE_URL}")
    logger.info(f"⚖️  Fairness Service: {settings.FAIRNESS_SERVICE_URL}")
    logger.info(f"🌐 API running at: http://{settings.API_HOST}:{settings.API_PORT}")
    logger.info(f"📂 Project root: {project_root}")


@app.on_event("shutdown")
async def shutdown_event():
    """Shutdown event handler."""
    logger.info("👋 FAIRMEDIA Backend shutting down...")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "backend.main:app",
        host=settings.API_HOST,
        port=settings.API_PORT,
        reload=settings.API_RELOAD
    )
