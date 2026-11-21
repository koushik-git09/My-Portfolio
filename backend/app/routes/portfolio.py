from fastapi import APIRouter
from app.schemas.portfolio import PortfolioResponse
from app.services.portfolio_service import portfolio_service

router = APIRouter(tags=["Portfolio"])


@router.get(
    "/portfolio",
    response_model=PortfolioResponse,
    summary="Retrieve Portfolio Content",
)
async def get_portfolio():
    """Retrieves full portfolio content from MongoDB when configured, with safe fallback."""
    return await portfolio_service.get_portfolio_data()
