from datetime import datetime, timezone
from fastapi import APIRouter
from app.core.config import settings
from app.core.database import get_connection_status

router = APIRouter(tags=["Health"])


@router.get("/health", summary="Health Check")
async def health_check():
    """Returns server runtime status and database connectivity status without exposing credentials."""
    db_status = get_connection_status()
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "environment": settings.ENVIRONMENT,
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "database": db_status,
    }
