from typing import Generic, TypeVar, Type, Optional, List, Any
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import delete, update
from app.core.database import Base

ModelType = TypeVar("ModelType", bound=Base)


class BaseRepository(Generic[ModelType]):
    """Generic repository providing basic CRUD operations."""

    def __init__(self, model: Type[ModelType], db: AsyncSession):
        self.model = model
        self.db = db

    async def get_by_id(self, id: Any) -> Optional[ModelType]:
        result = await self.db.execute(select(self.model).filter(self.model.id == id))
        return result.scalars().first()

    async def get_all(self, limit: int = 100, offset: int = 0) -> List[ModelType]:
        result = await self.db.execute(select(self.model).offset(offset).limit(limit))
        return list(result.scalars().all())

    async def create(self, instance: ModelType) -> ModelType:
        self.db.add(instance)
        await self.db.flush()
        await self.db.refresh(instance)
        return instance

    async def update(self, instance: ModelType) -> ModelType:
        await self.db.flush()
        await self.db.refresh(instance)
        return instance

    async def delete(self, id: Any) -> bool:
        result = await self.db.execute(delete(self.model).where(self.model.id == id))
        await self.db.flush()
        return result.rowcount > 0
