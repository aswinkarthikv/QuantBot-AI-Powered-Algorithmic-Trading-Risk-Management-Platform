export interface User {
  id: number;
  email: string;
  full_name: string;
  risk_tolerance: string;
  daily_loss_limit: number;
  created_at: string;
}

export interface AssetAllocation {
  category: string;
  value: number;
  percentage: number;
}

export interface Portfolio {
  cash_balance: number;
  total_equity: number;
  initial_balance: number;
  unrealized_pnl: number;
  realized_pnl: number;
  total_pnl: number;
  total_pnl_percent: number;
  allocations: AssetAllocation[];
}

export interface Position {
  id: number;
  symbol: string;
  quantity: number;
  avg_entry_price: number;
  current_price: number;
  unrealized_pnl: number;
  unrealized_pnl_percent: number;
  position_type: string;
  total_value: number;
}

export interface Asset {
  symbol: string;
  name: string;
  asset_class: string;
  current_price: number;
  change_24h: number;
  high_24h: number;
  low_24h: number;
  volume: number;
}

export interface Order {
  id: number;
  user_id: number;
  symbol: string;
  side: 'BUY' | 'SELL';
  order_type: 'MARKET' | 'LIMIT';
  quantity: number;
  price: number;
  executed_price?: number;
  status: 'PENDING' | 'EXECUTED' | 'CANCELLED';
  created_at: string;
}

export interface Strategy {
  id: number;
  name: string;
  description?: string;
  indicator_type: 'SMA' | 'EMA' | 'RSI' | 'MACD' | 'BOLLINGER';
  parameters: Record<string, any>;
  win_rate: number;
  total_return: number;
  is_active: boolean;
  created_at: string;
}

export interface BacktestResult {
  strategy_name: string;
  symbol: string;
  total_trades: number;
  winning_trades: number;
  losing_trades: number;
  win_rate: number;
  total_return_percent: number;
  max_drawdown_percent: number;
  sharpe_ratio: number;
  equity_curve: Array<{ day: number; equity: number; price: number }>;
  signals: Array<Record<string, any>>;
}

export interface RiskMetrics {
  risk_score: number;
  risk_level: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  current_drawdown: number;
  max_drawdown: number;
  daily_loss: number;
  daily_loss_limit: number;
  kelly_recommended_size_percent: number;
  volatility_adjusted_size: number;
  leverage_ratio: number;
  concentration_risk_percent: number;
  risk_alerts: string[];
}

export interface AIAudit {
  id: number;
  order_id: number;
  symbol: string;
  side: string;
  explanation: string;
  risk_assessment: string;
  confidence_score: number;
  detected_errors: string[];
  suggestions: string[];
  created_at: string;
}

export interface EquityCurvePoint {
  timestamp: string;
  portfolio_value: number;
  benchmark_value: number;
}

export interface PerformanceMetrics {
  total_return_percent: number;
  cagr: number;
  sharpe_ratio: number;
  sortino_ratio: number;
  max_drawdown: number;
  win_rate: number;
  profit_factor: number;
  total_trades: number;
  avg_trade_pnl: number;
  best_trade_pnl: number;
  worst_trade_pnl: number;
  equity_curve: EquityCurvePoint[];
  monthly_returns: Array<{ month: string; return_percent: number }>;
}
