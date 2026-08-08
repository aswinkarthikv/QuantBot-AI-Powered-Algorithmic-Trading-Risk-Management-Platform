import logging
import httpx
from app.core.config import settings

logger = logging.getLogger(__name__)


class NotificationService:

    @staticmethod
    async def send_telegram_alert(message: str) -> bool:
        """Dispatches alert message via Telegram Bot Webhook API."""
        if not settings.TELEGRAM_BOT_TOKEN or not settings.TELEGRAM_CHAT_ID:
            logger.info(f"[Telegram Alert Log Fallback]: {message}")
            return False

        try:
            url = f"https://api.telegram.org/bot{settings.TELEGRAM_BOT_TOKEN}/sendMessage"
            payload = {
                "chat_id": settings.TELEGRAM_CHAT_ID,
                "text": f"🤖 *QuantBot Alert*\n\n{message}",
                "parse_mode": "Markdown"
            }
            async with httpx.AsyncClient(timeout=5.0) as client:
                resp = await client.post(url, json=payload)
                return resp.status_code == 200
        except Exception as e:
            logger.error(f"Failed to dispatch Telegram notification: {e}")
            return False

    @staticmethod
    async def send_email_alert(recipient: str, subject: str, body: str) -> bool:
        """Dispatches email notification via SMTP abstraction."""
        if not settings.SMTP_USER or not settings.SMTP_PASSWORD:
            logger.info(f"[Email Alert Log Fallback to {recipient}]: {subject} - {body}")
            return False

        try:
            import smtplib
            from email.mime.text import MIMEText
            from email.mime.multipart import MIMEMultipart

            msg = MIMEMultipart()
            msg["From"] = settings.EMAILS_FROM_EMAIL
            msg["To"] = recipient
            msg["Subject"] = f"QuantBot Notification: {subject}"
            msg.attach(MIMEText(body, "plain"))

            with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT) as server:
                server.starttls()
                server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
                server.send_message(msg)
            return True
        except Exception as e:
            logger.error(f"Failed to dispatch Email notification: {e}")
            return False
