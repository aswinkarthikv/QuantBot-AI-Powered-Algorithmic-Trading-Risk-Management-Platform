from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.api.v1.deps import get_current_user
from app.models import User
from app.schemas import (
    RiskMetricsResponse,
    PositionSizingRequest,
    PositionSizingResponse
)
from app.services import RiskEngineService

router = APIRouter(prefix="/risk", tags=["Risk Engine"])


@router.get("/metrics", response_model=RiskMetricsResponse)
async def get_risk_metrics(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Fetch live risk metrics, Quant Risk Score (0-100), drawdown & limits."""
    service = RiskEngineService(db)
    return await service.calculate_risk_metrics(current_user.id)


@router.post("/position-size", response_model=PositionSizingResponse)
async def calculate_position_size(req: PositionSizingRequest):
    """Calculate optimal Kelly Criterion & Volatility Parity position size."""
    return RiskEngineService.compute_position_size(req)
