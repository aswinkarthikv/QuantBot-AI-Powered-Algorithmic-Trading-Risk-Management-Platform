from fastapi import APIRouter
from app.api.v1.endpoints import (
    auth,
    portfolio,
    trading,
    strategies,
    risk,
    ai_auditor,
    analytics,
    notifications
)

api_router = APIRouter()

api_router.include_router(auth.router)
api_router.include_router(portfolio.router)
api_router.include_router(trading.router)
api_router.include_router(strategies.router)
api_router.include_router(risk.router)
api_router.include_router(ai_auditor.router)
api_router.include_router(analytics.router)
api_router.include_router(notifications.router)
