from datetime import datetime, timezone
from typing import Optional, List
from sqlalchemy import String, Float, Integer, DateTime, Boolean, ForeignKey, Text, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)
    full_name: Mapped[str] = mapped_column(String(255), nullable=False)
    risk_tolerance: Mapped[str] = mapped_column(String(50), default="MODERATE") # LOW, MODERATE, HIGH, AGGRESSIVE
    daily_loss_limit: Mapped[float] = mapped_column(Float, default=2500.0)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc))

    # Relationships
    portfolio: Mapped[Optional["Portfolio"]] = relationship("Portfolio", back_populates="user", uselist=False, cascade="all, delete-orphan")
    positions: Mapped[List["Position"]] = relationship("Position", back_populates="user", cascade="all, delete-orphan")
    orders: Mapped[List["Order"]] = relationship("Order", back_populates="user", cascade="all, delete-orphan")
    strategies: Mapped[List["Strategy"]] = relationship("Strategy", back_populates="user", cascade="all, delete-orphan")
    audits: Mapped[List["AIAudit"]] = relationship("AIAudit", back_populates="user", cascade="all, delete-orphan")


class Portfolio(Base):
    __tablename__ = "portfolios"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    cash_balance: Mapped[float] = mapped_column(Float, default=100000.0)
    initial_balance: Mapped[float] = mapped_column(Float, default=100000.0)
    realized_pnl: Mapped[float] = mapped_column(Float, default=0.0)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    user: Mapped["User"] = relationship("User", back_populates="portfolio")


class Asset(Base):
    __tablename__ = "assets"

    symbol: Mapped[str] = mapped_column(String(20), primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    asset_class: Mapped[str] = mapped_column(String(50), default="EQUITY") # EQUITY, CRYPTO, FOREX, COMMODITY
    current_price: Mapped[float] = mapped_column(Float, nullable=False)
    change_24h: Mapped[float] = mapped_column(Float, default=0.0)
    high_24h: Mapped[float] = mapped_column(Float, default=0.0)
    low_24h: Mapped[float] = mapped_column(Float, default=0.0)
    volume: Mapped[float] = mapped_column(Float, default=0.0)


class Position(Base):
    __tablename__ = "positions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), nullable=False)
    symbol: Mapped[str] = mapped_column(String(20), nullable=False)
    quantity: Mapped[float] = mapped_column(Float, nullable=False)
    avg_entry_price: Mapped[float] = mapped_column(Float, nullable=False)
    current_price: Mapped[float] = mapped_column(Float, nullable=False)
    unrealized_pnl: Mapped[float] = mapped_column(Float, default=0.0)
    position_type: Mapped[str] = mapped_column(String(10), default="LONG") # LONG, SHORT
    created_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc))

    user: Mapped["User"] = relationship("User", back_populates="positions")


class Order(Base):
    __tablename__ = "orders"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), nullable=False)
    symbol: Mapped[str] = mapped_column(String(20), nullable=False)
    side: Mapped[str] = mapped_column(String(10), nullable=False) # BUY, SELL
    order_type: Mapped[str] = mapped_column(String(10), nullable=False) # MARKET, LIMIT
    quantity: Mapped[float] = mapped_column(Float, nullable=False)
    price: Mapped[float] = mapped_column(Float, nullable=False)
    executed_price: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    status: Mapped[str] = mapped_column(String(20), default="EXECUTED") # PENDING, EXECUTED, CANCELLED
    created_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc))

    user: Mapped["User"] = relationship("User", back_populates="orders")
    audits: Mapped[List["AIAudit"]] = relationship("AIAudit", back_populates="order", cascade="all, delete-orphan")


class Strategy(Base):
    __tablename__ = "strategies"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), nullable=False)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=True)
    indicator_type: Mapped[str] = mapped_column(String(50), nullable=False) # SMA, EMA, RSI, MACD, BOLLINGER
    parameters: Mapped[dict] = mapped_column(JSON, default=dict)
    win_rate: Mapped[float] = mapped_column(Float, default=65.5)
    total_return: Mapped[float] = mapped_column(Float, default=24.8)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc))

    user: Mapped["User"] = relationship("User", back_populates="strategies")


class AIAudit(Base):
    __tablename__ = "ai_audits"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    order_id: Mapped[int] = mapped_column(Integer, ForeignKey("orders.id"), nullable=False)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), nullable=False)
    symbol: Mapped[str] = mapped_column(String(20), nullable=False)
    side: Mapped[str] = mapped_column(String(10), nullable=False)
    explanation: Mapped[str] = mapped_column(Text, nullable=False)
    risk_assessment: Mapped[str] = mapped_column(Text, nullable=False)
    confidence_score: Mapped[int] = mapped_column(Integer, nullable=False) # 0 to 100
    detected_errors: Mapped[list] = mapped_column(JSON, default=list)
    suggestions: Mapped[list] = mapped_column(JSON, default=list)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc))

    user: Mapped["User"] = relationship("User", back_populates="audits")
    order: Mapped["Order"] = relationship("Order", back_populates="audits")


class RiskSnapshot(Base):
    __tablename__ = "risk_snapshots"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), nullable=False)
    current_drawdown: Mapped[float] = mapped_column(Float, default=0.0)
    max_drawdown: Mapped[float] = mapped_column(Float, default=0.0)
    risk_score: Mapped[int] = mapped_column(Integer, default=25)
    daily_loss: Mapped[float] = mapped_column(Float, default=0.0)
    kelly_size: Mapped[float] = mapped_column(Float, default=5.0)
    timestamp: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc))
