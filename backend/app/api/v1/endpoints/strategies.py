from typing import List
from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.api.v1.deps import get_current_user
from app.models import User, Strategy
from app.schemas import StrategyCreate, StrategyResponse, BacktestRequest, BacktestResult
from app.services import StrategyService
from app.repositories import StrategyRepository

router = APIRouter(prefix="/strategies", tags=["Strategy Lab"])


@router.get("", response_model=List[StrategyResponse])
async def list_strategies(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """List quantitative strategies configured by current user."""
    repo = StrategyRepository(db)
    return await repo.get_user_strategies(current_user.id)


@router.post("", response_model=StrategyResponse, status_code=status.HTTP_201_CREATED)
async def create_strategy(
    strategy_in: StrategyCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Create a new quantitative strategy."""
    repo = StrategyRepository(db)
    strat = Strategy(
        user_id=current_user.id,
        name=strategy_in.name,
        description=strategy_in.description,
        indicator_type=strategy_in.indicator_type,
        parameters=strategy_in.parameters,
        win_rate=64.2,
        total_return=19.5,
        is_active=True
    )
    return await repo.create(strat)


@router.post("/backtest", response_model=BacktestResult)
async def run_backtest(req: BacktestRequest):
    """Execute quantitative backtest simulation on historical price series."""
    return StrategyService.run_backtest(req)
