from typing import Optional, List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.repositories.base import BaseRepository
from app.models import User, Portfolio, Asset, Position, Order, Strategy, AIAudit, RiskSnapshot


class UserRepository(BaseRepository[User]):
    def __init__(self, db: AsyncSession):
        super().__init__(User, db)

    async def get_by_email(self, email: str) -> Optional[User]:
        result = await self.db.execute(select(User).where(User.email == email))
        return result.scalars().first()


class PortfolioRepository(BaseRepository[Portfolio]):
    def __init__(self, db: AsyncSession):
        super().__init__(Portfolio, db)

    async def get_by_user_id(self, user_id: int) -> Optional[Portfolio]:
        result = await self.db.execute(select(Portfolio).where(Portfolio.user_id == user_id))
        return result.scalars().first()


class AssetRepository(BaseRepository[Asset]):
    def __init__(self, db: AsyncSession):
        super().__init__(Asset, db)

    async def get_by_symbol(self, symbol: str) -> Optional[Asset]:
        result = await self.db.execute(select(Asset).where(Asset.symbol == symbol.upper()))
        return result.scalars().first()

    async def get_all_assets(self) -> List[Asset]:
        result = await self.db.execute(select(Asset))
        return list(result.scalars().all())


class PositionRepository(BaseRepository[Position]):
    def __init__(self, db: AsyncSession):
        super().__init__(Position, db)

    async def get_user_positions(self, user_id: int) -> List[Position]:
        result = await self.db.execute(select(Position).where(Position.user_id == user_id))
        return list(result.scalars().all())

    async def get_user_position_by_symbol(self, user_id: int, symbol: str) -> Optional[Position]:
        result = await self.db.execute(
            select(Position).where(Position.user_id == user_id, Position.symbol == symbol.upper())
        )
        return result.scalars().first()


class OrderRepository(BaseRepository[Order]):
    def __init__(self, db: AsyncSession):
        super().__init__(Order, db)

    async def get_user_orders(self, user_id: int, limit: int = 50) -> List[Order]:
        result = await self.db.execute(
            select(Order).where(Order.user_id == user_id).order_by(Order.created_at.desc()).limit(limit)
        )
        return list(result.scalars().all())


class StrategyRepository(BaseRepository[Strategy]):
    def __init__(self, db: AsyncSession):
        super().__init__(Strategy, db)

    async def get_user_strategies(self, user_id: int) -> List[Strategy]:
        result = await self.db.execute(select(Strategy).where(Strategy.user_id == user_id))
        return list(result.scalars().all())


class AIAuditRepository(BaseRepository[AIAudit]):
    def __init__(self, db: AsyncSession):
        super().__init__(AIAudit, db)

    async def get_user_audits(self, user_id: int, limit: int = 20) -> List[AIAudit]:
        result = await self.db.execute(
            select(AIAudit).where(AIAudit.user_id == user_id).order_by(AIAudit.created_at.desc()).limit(limit)
        )
        return list(result.scalars().all())

    async def get_audit_by_order_id(self, order_id: int) -> Optional[AIAudit]:
        result = await self.db.execute(select(AIAudit).where(AIAudit.order_id == order_id))
        return result.scalars().first()
