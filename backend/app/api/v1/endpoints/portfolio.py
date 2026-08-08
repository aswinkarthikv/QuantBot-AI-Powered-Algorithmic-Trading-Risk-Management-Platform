from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.api.v1.deps import get_current_user
from app.models import User
from app.schemas import PortfolioResponse, PositionResponse, AssetResponse
from app.services import TradingService
from app.repositories import PositionRepository, AssetRepository

router = APIRouter(prefix="/portfolio", tags=["Portfolio"])


@router.get("", response_model=PortfolioResponse)
async def get_portfolio(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Retrieve full portfolio summary, cash balance, and equity breakdown."""
    trading_service = TradingService(db)
    return await trading_service.get_portfolio_summary(current_user.id)


@router.get("/positions", response_model=List[PositionResponse])
async def get_positions(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Retrieve active positions for current user."""
    position_repo = PositionRepository(db)
    positions = await position_repo.get_user_positions(current_user.id)
    
    result = []
    for p in positions:
        total_val = p.quantity * p.current_price
        unrealized_pct = ((p.current_price - p.avg_entry_price) / p.avg_entry_price * 100.0) if p.avg_entry_price > 0 else 0.0
        result.append(PositionResponse(
            id=p.id,
            symbol=p.symbol,
            quantity=p.quantity,
            avg_entry_price=p.avg_entry_price,
            current_price=p.current_price,
            unrealized_pnl=p.unrealized_pnl,
            unrealized_pnl_percent=round(unrealized_pct, 2),
            position_type=p.position_type,
            total_value=round(total_val, 2)
        ))
    return result


@router.get("/assets", response_model=List[AssetResponse])
async def get_assets(db: AsyncSession = Depends(get_db)):
    """Retrieve tradable tickers and live asset prices."""
    asset_repo = AssetRepository(db)
    return await asset_repo.get_all_assets()
