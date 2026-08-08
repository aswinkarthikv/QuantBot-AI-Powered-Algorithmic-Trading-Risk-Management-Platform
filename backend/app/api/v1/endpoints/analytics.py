from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.api.v1.deps import get_current_user
from app.models import User
from app.schemas import PerformanceMetricsResponse
from app.services import AnalyticsService

router = APIRouter(prefix="/analytics", tags=["Analytics Dashboard"])


@router.get("/performance", response_model=PerformanceMetricsResponse)
async def get_performance_analytics(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Retrieve equity curve, Sharpe ratio, CAGR, win rate, and monthly returns matrix."""
    service = AnalyticsService(db)
    return await service.get_performance_analytics(current_user.id)
