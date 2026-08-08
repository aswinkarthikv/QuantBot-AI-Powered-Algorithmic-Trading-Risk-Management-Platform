import asyncio
import pytest
import pytest_asyncio
from httpx import AsyncClient, ASGITransport
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker

from app.main import app
from app.core.database import Base, get_db
from app.core.security import create_access_token, get_password_hash
from app.models import User, Portfolio, Asset

TEST_DATABASE_URL = "sqlite+aiosqlite:///:memory:"

test_engine = create_async_engine(TEST_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = async_sessionmaker(bind=test_engine, class_=AsyncSession, expire_on_commit=False)


@pytest_asyncio.fixture(scope="function")
async def db_session():
    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with TestingSessionLocal() as session:
        yield session

    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)


@pytest_asyncio.fixture(scope="function")
async def client(db_session):
    async def _override_get_db():
        yield db_session

    app.dependency_overrides[get_db] = _override_get_db
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as c:
        yield c
    app.dependency_overrides.clear()


@pytest_asyncio.fixture(scope="function")
async def test_user(db_session):
    user = User(
        email="testtrader@quantbot.com",
        hashed_password=get_password_hash("Password123!"),
        full_name="Test Quant Trader",
        risk_tolerance="MODERATE",
        daily_loss_limit=2500.0
    )
    db_session.add(user)
    await db_session.flush()

    portfolio = Portfolio(user_id=user.id, cash_balance=100000.0, initial_balance=100000.0)
    db_session.add(portfolio)

    asset = Asset(symbol="AAPL", name="Apple Inc.", asset_class="EQUITY", current_price=220.0, change_24h=1.5, high_24h=225.0, low_24h=218.0, volume=50000000)
    db_session.add(asset)

    await db_session.commit()
    return user


@pytest_asyncio.fixture(scope="function")
def auth_headers(test_user):
    token = create_access_token(subject=test_user.id)
    return {"Authorization": f"Bearer {token}"}
