from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories import UserRepository, PortfolioRepository
from app.schemas import UserRegister, UserLogin, ProfileUpdate
from app.models import User, Portfolio
from app.core.security import get_password_hash, verify_password, create_access_token
from app.core.exceptions import AuthenticationError, QuantBotException


class AuthService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.user_repo = UserRepository(db)
        self.portfolio_repo = PortfolioRepository(db)

    async def register_user(self, user_in: UserRegister) -> User:
        existing = await self.user_repo.get_by_email(user_in.email)
        if existing:
            raise QuantBotException(message="User with this email already exists", code="EMAIL_TAKEN")

        user = User(
            email=user_in.email,
            hashed_password=get_password_hash(user_in.password),
            full_name=user_in.full_name,
            risk_tolerance=user_in.risk_tolerance or "MODERATE",
            daily_loss_limit=user_in.daily_loss_limit or 2500.0
        )
        user = await self.user_repo.create(user)

        # Initialize portfolio with default $100,000 cash balance
        portfolio = Portfolio(
            user_id=user.id,
            cash_balance=100000.0,
            initial_balance=100000.0
        )
        await self.portfolio_repo.create(portfolio)

        return user

    async def authenticate_user(self, login_in: UserLogin) -> dict:
        user = await self.user_repo.get_by_email(login_in.email)
        if not user or not verify_password(login_in.password, user.hashed_password):
            raise AuthenticationError(message="Invalid email or password")

        access_token = create_access_token(subject=user.id)
        return {"access_token": access_token, "token_type": "bearer", "user": user}

    async def update_profile(self, user_id: int, profile_in: ProfileUpdate) -> User:
        user = await self.user_repo.get_by_id(user_id)
        if not user:
            raise QuantBotException(message="User not found", code="NOT_FOUND", status_code=404)

        if profile_in.full_name is not None:
            user.full_name = profile_in.full_name
        if profile_in.risk_tolerance is not None:
            user.risk_tolerance = profile_in.risk_tolerance
        if profile_in.daily_loss_limit is not None:
            user.daily_loss_limit = profile_in.daily_loss_limit

        return await self.user_repo.update(user)
