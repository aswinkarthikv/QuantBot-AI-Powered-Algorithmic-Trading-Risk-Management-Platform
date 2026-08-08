from fastapi import Depends, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.core.security import decode_access_token
from app.core.exceptions import AuthenticationError
from app.repositories import UserRepository
from app.models import User

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")


async def get_current_user(
    db: AsyncSession = Depends(get_db),
    token: str = Depends(oauth2_scheme)
) -> User:
    """FastAPI dependency that extracts and validates current authenticated user from JWT bearer token."""
    payload = decode_access_token(token)
    if not payload or "sub" not in payload:
        raise AuthenticationError(message="Invalid or expired authentication token")

    user_id = int(payload["sub"])
    user_repo = UserRepository(db)
    user = await user_repo.get_by_id(user_id)
    if not user:
        raise AuthenticationError(message="User not found")

    return user
