from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, EmailStr, Field, ConfigDict


# --- AUTH SCHEMAS ---
class UserRegister(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6, description="Password must be at least 6 characters")
    full_name: str = Field(..., min_length=2)
    risk_tolerance: Optional[str] = "MODERATE"
    daily_loss_limit: Optional[float] = 2500.0


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    email: str
    full_name: str
    risk_tolerance: str
    daily_loss_limit: float
    created_at: datetime


class ProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    risk_tolerance: Optional[str] = None
    daily_loss_limit: Optional[float] = None


# --- PORTFOLIO SCHEMAS ---
class AssetAllocation(BaseModel):
    category: str
    value: float
    percentage: float


class PortfolioResponse(BaseModel):
    cash_balance: float
    total_equity: float
    initial_balance: float
    unrealized_pnl: float
    realized_pnl: float
    total_pnl: float
    total_pnl_percent: float
    allocations: List[AssetAllocation]


# --- TRADING SCHEMAS ---
class OrderCreate(BaseModel):
    symbol: str
    side: str = Field(..., description="BUY or SELL")
    order_type: str = Field(..., description="MARKET or LIMIT")
    quantity: float = Field(..., gt=0, description="Order quantity must be greater than 0")
    price: Optional[float] = Field(None, description="Limit price (optional for MARKET)")


class OrderResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    user_id: int
    symbol: str
    side: str
    order_type: str
    quantity: float
    price: float
    executed_price: Optional[float]
    status: str
    created_at: datetime


class PositionResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    symbol: str
    quantity: float
    avg_entry_price: float
    current_price: float
    unrealized_pnl: float
    unrealized_pnl_percent: float
    position_type: str
    total_value: float


class AssetResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    symbol: str
    name: str
    asset_class: str
    current_price: float
    change_24h: float
    high_24h: float
    low_24h: float
    volume: float


# --- STRATEGY SCHEMAS ---
class StrategyCreate(BaseModel):
    name: str
    description: Optional[str] = None
    indicator_type: str = Field(..., description="SMA, EMA, RSI, MACD, BOLLINGER")
    parameters: Dict[str, Any] = Field(default_factory=dict)


class StrategyResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    description: Optional[str]
    indicator_type: str
    parameters: Dict[str, Any]
    win_rate: float
    total_return: float
    is_active: bool
    created_at: datetime


class BacktestRequest(BaseModel):
    symbol: str = "AAPL"
    indicator_type: str = "RSI" # SMA, EMA, RSI, MACD, BOLLINGER
    period: int = 14
    short_window: Optional[int] = 10
    long_window: Optional[int] = 50
    overbought: Optional[int] = 70
    oversold: Optional[int] = 30
    initial_capital: float = 10000.0


class BacktestResult(BaseModel):
    strategy_name: str
    symbol: str
    total_trades: int
    winning_trades: int
    losing_trades: int
    win_rate: float
    total_return_percent: float
    max_drawdown_percent: float
    sharpe_ratio: float
    equity_curve: List[Dict[str, Any]]
    signals: List[Dict[str, Any]]


# --- RISK SCHEMAS ---
class RiskMetricsResponse(BaseModel):
    risk_score: int # 0 to 100
    risk_level: str # LOW, MODERATE, HIGH, CRITICAL
    current_drawdown: float
    max_drawdown: float
    daily_loss: float
    daily_loss_limit: float
    kelly_recommended_size_percent: float
    volatility_adjusted_size: float
    leverage_ratio: float
    concentration_risk_percent: float
    risk_alerts: List[str]


class PositionSizingRequest(BaseModel):
    account_balance: float
    win_rate: float = Field(0.60, ge=0, le=1)
    win_loss_ratio: float = Field(1.5, gt=0)
    asset_volatility: float = Field(0.02, gt=0) # 2% daily volatility
    risk_per_trade_percent: float = Field(2.0, gt=0, le=100)


class PositionSizingResponse(BaseModel):
    full_kelly_percent: float
    half_kelly_percent: float
    recommended_position_usd: float
    max_allowable_shares: int
    risk_assessment_notes: str


# --- AI AUDITOR SCHEMAS ---
class AIAuditRequest(BaseModel):
    order_id: int


class AIAuditResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    order_id: int
    symbol: str
    side: str
    explanation: str
    risk_assessment: str
    confidence_score: int
    detected_errors: List[str]
    suggestions: List[str]
    created_at: datetime


# --- ANALYTICS SCHEMAS ---
class EquityCurvePoint(BaseModel):
    timestamp: str
    portfolio_value: float
    benchmark_value: float


class PerformanceMetricsResponse(BaseModel):
    total_return_percent: float
    cagr: float
    sharpe_ratio: float
    sortino_ratio: float
    max_drawdown: float
    win_rate: float
    profit_factor: float
    total_trades: int
    avg_trade_pnl: float
    best_trade_pnl: float
    worst_trade_pnl: float
    equity_curve: List[EquityCurvePoint]
    monthly_returns: List[Dict[str, Any]]
