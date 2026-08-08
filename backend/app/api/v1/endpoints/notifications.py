from fastapi import APIRouter, Depends, Body
from app.api.v1.deps import get_current_user
from app.models import User
from app.services import NotificationService

router = APIRouter(prefix="/notifications", tags=["Notifications"])


@router.post("/test-telegram")
async def test_telegram_notification(
    message: str = Body(..., embed=True),
    current_user: User = Depends(get_current_user)
):
    """Test Telegram Bot notification dispatcher."""
    sent = await NotificationService.send_telegram_alert(message)
    return {"success": sent, "message": "Telegram notification test dispatched"}


@router.post("/test-email")
async def test_email_notification(
    subject: str = Body(...),
    body: str = Body(...),
    current_user: User = Depends(get_current_user)
):
    """Test Email notification dispatcher."""
    sent = await NotificationService.send_email_alert(current_user.email, subject, body)
    return {"success": sent, "message": f"Email notification test dispatched to {current_user.email}"}
