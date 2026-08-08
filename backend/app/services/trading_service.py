from typing import List, Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories import (
    OrderRepository,
    PositionRepository,
    PortfolioRepository,
    AssetRepository
)
from app.models import Order, Position, Portfolio, Asset
from app.schemas import OrderCreate, PortfolioResponse, AssetAllocation
from app.core.exceptions import InsufficientFundsError, ResourceNotFoundError, QuantBotException


class TradingService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.order_repo = OrderRepository(db)
        self.position_repo = PositionRepository(db)
        self.portfolio_repo = PortfolioRepository(db)
        self.asset_repo = AssetRepository(db)

    async def execute_order(self, user_id: int, order_in: OrderCreate) -> Order:
        symbol = order_in.symbol.upper()
        asset = await self.asset_repo.get_by_symbol(symbol)
        
        # Default price fallback if asset not seeded yet
        current_price = asset.current_price if asset else (order_in.price or 150.0)
        executed_price = order_in.price if order_in.order_type == "LIMIT" and order_in.price else current_price

        portfolio = await self.portfolio_repo.get_by_user_id(user_id)
        if not portfolio:
            raise ResourceNotFoundError(message="Portfolio not found for user")

        total_cost = order_in.quantity * executed_price

        if order_in.side.upper() == "BUY":
            if portfolio.cash_balance < total_cost:
                raise InsufficientFundsError(
                    message=f"Required ${total_cost:,.2f}, but only ${portfolio.cash_balance:,.2f} available"
                )

            # Deduct cash
            portfolio.cash_balance -= total_cost

            # Update or create Position
            position = await self.position_repo.get_user_position_by_symbol(user_id, symbol)
            if position:
                new_qty = position.quantity + order_in.quantity
                new_avg_price = ((position.quantity * position.avg_entry_price) + total_cost) / new_qty
                position.quantity = new_qty
                position.avg_entry_price = new_avg_price
                position.current_price = current_price
                position.unrealized_pnl = (current_price - new_avg_price) * new_qty
                await self.position_repo.update(position)
            else:
                position = Position(
                    user_id=user_id,
                    symbol=symbol,
                    quantity=order_in.quantity,
                    avg_entry_price=executed_price,
                    current_price=current_price,
                    unrealized_pnl=0.0,
                    position_type="LONG"
                )
                await self.position_repo.create(position)

        elif order_in.side.upper() == "SELL":
            position = await self.position_repo.get_user_position_by_symbol(user_id, symbol)
            if not position or position.quantity < order_in.quantity:
                available_qty = position.quantity if position else 0.0
                raise QuantBotException(
                    message=f"Cannot sell {order_in.quantity} shares of {symbol}. Available: {available_qty}"
                )

            # Credit cash and compute realized PnL
            portfolio.cash_balance += total_cost
            realized_gain = (executed_price - position.avg_entry_price) * order_in.quantity
            portfolio.realized_pnl += realized_gain

            new_qty = position.quantity - order_in.quantity
            if new_qty <= 0:
                await self.position_repo.delete(position.id)
            else:
                position.quantity = new_qty
                position.unrealized_pnl = (current_price - position.avg_entry_price) * new_qty
                await self.position_repo.update(position)

        await self.portfolio_repo.update(portfolio)

        # Record Order
        order = Order(
            user_id=user_id,
            symbol=symbol,
            side=order_in.side.upper(),
            order_type=order_in.order_type.upper(),
            quantity=order_in.quantity,
            price=executed_price,
            executed_price=executed_price,
            status="EXECUTED"
        )
        return await self.order_repo.create(order)

    async def get_portfolio_summary(self, user_id: int) -> PortfolioResponse:
        portfolio = await self.portfolio_repo.get_by_user_id(user_id)
        if not portfolio:
            portfolio = Portfolio(user_id=user_id, cash_balance=100000.0, initial_balance=100000.0)
            portfolio = await self.portfolio_repo.create(portfolio)

        positions = await self.position_repo.get_user_positions(user_id)
        
        positions_value = sum(p.quantity * p.current_price for p in positions)
        unrealized_pnl = sum(p.unrealized_pnl for p in positions)
        total_equity = portfolio.cash_balance + positions_value
        total_pnl = portfolio.realized_pnl + unrealized_pnl
        total_pnl_percent = (total_pnl / portfolio.initial_balance) * 100.0 if portfolio.initial_balance > 0 else 0.0

        # Calculate Asset Allocation
        allocations: List[AssetAllocation] = []
        if total_equity > 0:
            allocations.append(AssetAllocation(
                category="Cash",
                value=portfolio.cash_balance,
                percentage=round((portfolio.cash_balance / total_equity) * 100, 2)
            ))
            
            for pos in positions:
                pos_val = pos.quantity * pos.current_price
                allocations.append(AssetAllocation(
                    category=pos.symbol,
                    value=pos_val,
                    percentage=round((pos_val / total_equity) * 100, 2)
                ))

        return PortfolioResponse(
            cash_balance=portfolio.cash_balance,
            total_equity=total_equity,
            initial_balance=portfolio.initial_balance,
            unrealized_pnl=unrealized_pnl,
            realized_pnl=portfolio.realized_pnl,
            total_pnl=total_pnl,
            total_pnl_percent=total_pnl_percent,
            allocations=allocations
        )
