from fastapi import APIRouter, Depends, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.schemas import UserRegister, UserLogin, Token, UserResponse, ProfileUpdate
from app.services import AuthService
from app.api.v1.deps import get_current_user
from app.models import User

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(user_in: UserRegister, db: AsyncSession = Depends(get_db)):
    """Register a new QuantBot user account."""
    auth_service = AuthService(db)
    return await auth_service.register_user(user_in)


@router.post("/login", response_model=Token)
async def login(login_in: UserLogin, db: AsyncSession = Depends(get_db)):
    """Authenticate user with email/password and obtain JWT access token."""
    auth_service = AuthService(db)
    result = await auth_service.authenticate_user(login_in)
    return Token(access_token=result["access_token"], token_type="bearer")


@router.get("/me", response_model=UserResponse)
async def get_me(current_user: User = Depends(get_current_user)):
    """Fetch current authenticated user profile."""
    return current_user


@router.put("/profile", response_model=UserResponse)
async def update_profile(
    profile_in: ProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Update current user risk preferences or name."""
    auth_service = AuthService(db)
    return await auth_service.update_profile(current_user.id, profile_in)
