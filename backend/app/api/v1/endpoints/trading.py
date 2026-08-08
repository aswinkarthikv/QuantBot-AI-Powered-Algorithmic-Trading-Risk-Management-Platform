from typing import List
from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.api.v1.deps import get_current_user
from app.models import User
from app.schemas import OrderCreate, OrderResponse
from app.services import TradingService, NotificationService
from app.repositories import OrderRepository

router = APIRouter(prefix="/trading", tags=["Trading Engine"])


@router.post("/orders", response_model=OrderResponse, status_code=status.HTTP_201_CREATED)
async def submit_order(
    order_in: OrderCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Execute a BUY or SELL Market/Limit order."""
    trading_service = TradingService(db)
    order = await trading_service.execute_order(current_user.id, order_in)

    # Trigger notification
    alert_msg = f"Order Executed: {order.side} {order.quantity} {order.symbol} @ ${order.executed_price:,.2f}"
    await NotificationService.send_telegram_alert(alert_msg)

    return order


@router.get("/orders", response_model=List[OrderResponse])
async def get_order_history(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Retrieve order history for current user."""
    order_repo = OrderRepository(db)
    return await order_repo.get_user_orders(current_user.id)
