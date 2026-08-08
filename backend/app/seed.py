import asyncio
import logging
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.core.database import Base, engine, AsyncSessionLocal
from app.core.security import get_password_hash
from app.models import User, Portfolio, Asset, Position, Order, Strategy, AIAudit

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


async def seed_data(db: AsyncSession):
    # Create DB tables
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    # Check if demo user exists
    result = await db.execute(select(User).where(User.email == "demo@quantbot.com"))
    existing_user = result.scalars().first()

    if existing_user:
        logger.info("Demo data already seeded.")
        return

    logger.info("Seeding initial QuantBot demo data...")

    # 1. Create Demo User
    demo_user = User(
        email="demo@quantbot.com",
        hashed_password=get_password_hash("Password123!"),
        full_name="Alex Mercer (Quant Trader)",
        risk_tolerance="MODERATE",
        daily_loss_limit=3500.0
    )
    db.add(demo_user)
    await db.flush()

    # 2. Seed Assets
    assets_data = [
        Asset(symbol="AAPL", name="Apple Inc.", asset_class="EQUITY", current_price=224.50, change_24h=1.85, high_24h=226.10, low_24h=221.40, volume=54200000),
        Asset(symbol="NVDA", name="NVIDIA Corporation", asset_class="EQUITY", current_price=128.40, change_24h=4.12, high_24h=130.00, low_24h=124.20, volume=89100000),
        Asset(symbol="TSLA", name="Tesla Inc.", asset_class="EQUITY", current_price=218.80, change_24h=-2.35, high_24h=224.00, low_24h=215.50, volume=43000000),
        Asset(symbol="MSFT", name="Microsoft Corp.", asset_class="EQUITY", current_price=448.20, change_24h=0.75, high_24h=451.00, low_24h=445.10, volume=21000000),
        Asset(symbol="BTC/USD", name="Bitcoin", asset_class="CRYPTO", current_price=64250.00, change_24h=3.45, high_24h=65100.00, low_24h=62800.00, volume=28400000000),
        Asset(symbol="ETH/USD", name="Ethereum", asset_class="CRYPTO", current_price=3480.00, change_24h=2.10, high_24h=3520.00, low_24h=3410.00, volume=14200000000),
    ]
    db.add_all(assets_data)

    # 3. Create Portfolio
    portfolio = Portfolio(
        user_id=demo_user.id,
        cash_balance=42500.00,
        initial_balance=100000.00,
        realized_pnl=8450.00
    )
    db.add(portfolio)

    # 4. Create Positions
    positions = [
        Position(user_id=demo_user.id, symbol="AAPL", quantity=100, avg_entry_price=210.00, current_price=224.50, unrealized_pnl=1450.00, position_type="LONG"),
        Position(user_id=demo_user.id, symbol="NVDA", quantity=150, avg_entry_price=115.00, current_price=128.40, unrealized_pnl=2010.00, position_type="LONG"),
        Position(user_id=demo_user.id, symbol="BTC/USD", quantity=0.25, avg_entry_price=61000.00, current_price=64250.00, unrealized_pnl=812.50, position_type="LONG"),
    ]
    db.add_all(positions)

    # 5. Create Historical Orders
    orders = [
        Order(user_id=demo_user.id, symbol="AAPL", side="BUY", order_type="LIMIT", quantity=100, price=210.00, executed_price=210.00, status="EXECUTED"),
        Order(user_id=demo_user.id, symbol="NVDA", side="BUY", order_type="MARKET", quantity=150, price=115.00, executed_price=115.00, status="EXECUTED"),
        Order(user_id=demo_user.id, symbol="BTC/USD", side="BUY", order_type="LIMIT", quantity=0.25, price=61000.00, executed_price=61000.00, status="EXECUTED"),
        Order(user_id=demo_user.id, symbol="TSLA", side="SELL", order_type="MARKET", quantity=50, price=225.00, executed_price=225.00, status="EXECUTED"),
    ]
    db.add_all(orders)
    await db.flush()

    # 6. Create AI Trade Audits
    audits = [
        AIAudit(
            order_id=orders[0].id,
            user_id=demo_user.id,
            symbol="AAPL",
            side="BUY",
            explanation="Limit buy order executed at major support level near the 50-day EMA ($210.00).",
            risk_assessment="Disciplined limit order execution with controlled downside exposure. Risk-to-reward ratio estimated at 1:3.2.",
            confidence_score=92,
            detected_errors=["Sub-optimal Position Size: Size allocation slightly below Half-Kelly optimal recommendation."],
            suggestions=[
                "Scale in with a secondary tranche upon breakout validation above $225.",
                "Maintain stop-loss strictly at $202.50."
            ]
        ),
        AIAudit(
            order_id=orders[1].id,
            user_id=demo_user.id,
            symbol="NVDA",
            side="BUY",
            explanation="Market buy executed during breakout momentum phase.",
            risk_assessment="High momentum play. Slippage risk detected on market order entry.",
            confidence_score=78,
            detected_errors=["Slippage Exposure: Executed via Market order during high volatility window."],
            suggestions=[
                "Use Limit or Stop-Limit orders to bound slippage within 0.2%.",
                "Trail stop-loss aggressively using 14-day ATR."
            ]
        )
    ]
    db.add_all(audits)

    # 7. Create Strategies
    strategies = [
        Strategy(
            user_id=demo_user.id,
            name="RSI Mean Reversion Alpha",
            description="Executes long entries when 14-day RSI drops below 30 (oversold) and exits above 70 (overbought).",
            indicator_type="RSI",
            parameters={"period": 14, "oversold": 30, "overbought": 70},
            win_rate=68.5,
            total_return=31.2,
            is_active=True
        ),
        Strategy(
            user_id=demo_user.id,
            name="SMA Golden Cross Momentum",
            description="Captures trend regime changes using 10-day short SMA vs 50-day long SMA crossover.",
            indicator_type="SMA",
            parameters={"short_window": 10, "long_window": 50},
            win_rate=62.0,
            total_return=24.8,
            is_active=True
        )
    ]
    db.add_all(strategies)

    await db.commit()
    logger.info("Demo data seeding completed successfully!")


if __name__ == "__main__":
    async def main():
        async with AsyncSessionLocal() as session:
            await seed_data(session)
    asyncio.run(main())
