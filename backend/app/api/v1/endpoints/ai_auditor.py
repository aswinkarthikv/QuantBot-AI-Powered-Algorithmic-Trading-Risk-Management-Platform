from typing import List
from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.api.v1.deps import get_current_user
from app.models import User
from app.schemas import AIAuditResponse, AIAuditRequest
from app.services import AIAuditorService
from app.repositories import AIAuditRepository

router = APIRouter(prefix="/ai", tags=["AI Trade Auditor"])


@router.post("/audit/{order_id}", response_model=AIAuditResponse, status_code=status.HTTP_201_CREATED)
async def audit_order(
    order_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Trigger AI Trade Auditor analysis for a specific trade order."""
    service = AIAuditorService(db)
    return await service.audit_trade(order_id, current_user.id)


@router.get("/audits", response_model=List[AIAuditResponse])
async def get_user_audits(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Fetch history of AI trade audits for current user."""
    repo = AIAuditRepository(db)
    audits = await repo.get_user_audits(current_user.id)
    return [AIAuditResponse.model_validate(a) for a in audits]
