import axios from 'axios';
import {
  User,
  Portfolio,
  Position,
  Asset,
  Order,
  Strategy,
  BacktestResult,
  RiskMetrics,
  AIAudit,
  PerformanceMetrics
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api/v1';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('quantbot_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Fallback Mock Datasets for standalone zero-backend preview mode
const MOCK_USER: User = {
  id: 1,
  email: 'demo@quantbot.com',
  full_name: 'Alex Mercer (Quant Trader)',
  risk_tolerance: 'MODERATE',
  daily_loss_limit: 3500,
  created_at: new Date().toISOString(),
};

const MOCK_PORTFOLIO: Portfolio = {
  cash_balance: 42500,
  total_equity: 108450,
  initial_balance: 100000,
  unrealized_pnl: 4272.5,
  realized_pnl: 4177.5,
  total_pnl: 8450,
  total_pnl_percent: 8.45,
  allocations: [
    { category: 'Cash', value: 42500, percentage: 39.19 },
    { category: 'AAPL', value: 22450, percentage: 20.70 },
    { category: 'NVDA', value: 19260, percentage: 17.76 },
    { category: 'BTC/USD', value: 16062.5, percentage: 14.81 },
    { category: 'TSLA', value: 8177.5, percentage: 7.54 },
  ],
};

const MOCK_POSITIONS: Position[] = [
  { id: 1, symbol: 'AAPL', quantity: 100, avg_entry_price: 210.0, current_price: 224.5, unrealized_pnl: 1450.0, unrealized_pnl_percent: 6.9, position_type: 'LONG', total_value: 22450 },
  { id: 2, symbol: 'NVDA', quantity: 150, avg_entry_price: 115.0, current_price: 128.4, unrealized_pnl: 2010.0, unrealized_pnl_percent: 11.65, position_type: 'LONG', total_value: 19260 },
  { id: 3, symbol: 'BTC/USD', quantity: 0.25, avg_entry_price: 61000.0, current_price: 64250.0, unrealized_pnl: 812.5, unrealized_pnl_percent: 5.33, position_type: 'LONG', total_value: 16062.5 },
];

const MOCK_ASSETS: Asset[] = [
  { symbol: 'AAPL', name: 'Apple Inc.', asset_class: 'EQUITY', current_price: 224.5, change_24h: 1.85, high_24h: 226.1, low_24h: 221.4, volume: 54200000 },
  { symbol: 'NVDA', name: 'NVIDIA Corporation', asset_class: 'EQUITY', current_price: 128.4, change_24h: 4.12, high_24h: 130.0, low_24h: 124.2, volume: 89100000 },
  { symbol: 'TSLA', name: 'Tesla Inc.', asset_class: 'EQUITY', current_price: 218.8, change_24h: -2.35, high_24h: 224.0, low_24h: 215.5, volume: 43000000 },
  { symbol: 'MSFT', name: 'Microsoft Corp.', asset_class: 'EQUITY', current_price: 448.2, change_24h: 0.75, high_24h: 451.0, low_24h: 445.1, volume: 21000000 },
  { symbol: 'BTC/USD', name: 'Bitcoin', asset_class: 'CRYPTO', current_price: 64250.0, change_24h: 3.45, high_24h: 65100.0, low_24h: 62800.0, volume: 28400000000 },
  { symbol: 'ETH/USD', name: 'Ethereum', asset_class: 'CRYPTO', current_price: 3480.0, change_24h: 2.1, high_24h: 3520.0, low_24h: 3410.0, volume: 14200000000 },
];

const MOCK_ORDERS: Order[] = [
  { id: 101, user_id: 1, symbol: 'AAPL', side: 'BUY', order_type: 'LIMIT', quantity: 100, price: 210.0, executed_price: 210.0, status: 'EXECUTED', created_at: '2026-08-01T14:30:00Z' },
  { id: 102, user_id: 1, symbol: 'NVDA', side: 'BUY', order_type: 'MARKET', quantity: 150, price: 115.0, executed_price: 115.0, status: 'EXECUTED', created_at: '2026-08-03T10:15:00Z' },
  { id: 103, user_id: 1, symbol: 'BTC/USD', side: 'BUY', order_type: 'LIMIT', quantity: 0.25, price: 61000.0, executed_price: 61000.0, status: 'EXECUTED', created_at: '2026-08-05T18:45:00Z' },
  { id: 104, user_id: 1, symbol: 'TSLA', side: 'SELL', order_type: 'MARKET', quantity: 50, price: 225.0, executed_price: 225.0, status: 'EXECUTED', created_at: '2026-08-07T11:20:00Z' },
];

const MOCK_AUDITS: AIAudit[] = [
  {
    id: 1,
    order_id: 101,
    symbol: 'AAPL',
    side: 'BUY',
    explanation: 'Limit buy order executed at major technical support level near 50-day EMA ($210.00).',
    risk_assessment: 'Disciplined limit entry with strictly defined risk parameters. Estimated R:R ratio is 1:3.2.',
    confidence_score: 92,
    detected_errors: ['Sub-optimal Position Size: Size allocation slightly below Half-Kelly optimal recommendation.'],
    suggestions: ['Scale in with secondary tranche upon breakout validation above $225', 'Maintain stop-loss at $202.50'],
    created_at: '2026-08-01T14:31:00Z',
  },
  {
    id: 2,
    order_id: 102,
    symbol: 'NVDA',
    side: 'BUY',
    explanation: 'Market buy executed during breakout momentum phase above resistance.',
    risk_assessment: 'High momentum play. Slippage risk detected on market order entry.',
    confidence_score: 78,
    detected_errors: ['Slippage Exposure: Executed via Market order during high intraday volatility.'],
    suggestions: ['Use Limit or Stop-Limit orders to bound slippage within 0.2%', 'Trail stop-loss aggressively using 14-day ATR'],
    created_at: '2026-08-03T10:16:00Z',
  },
];

const MOCK_RISK: RiskMetrics = {
  risk_score: 28,
  risk_level: 'MODERATE',
  current_drawdown: 1.85,
  max_drawdown: 4.20,
  daily_loss: 450.0,
  daily_loss_limit: 3500.0,
  kelly_recommended_size_percent: 7.5,
  volatility_adjusted_size: 4.2,
  leverage_ratio: 0.61,
  concentration_risk_percent: 20.7,
  risk_alerts: ['Optimal risk profile: All portfolio safety metrics within limits.'],
};

const MOCK_ANALYTICS: PerformanceMetrics = {
  total_return_percent: 8.45,
  cagr: 24.5,
  sharpe_ratio: 2.15,
  sortino_ratio: 2.85,
  max_drawdown: 4.2,
  win_rate: 68.5,
  profit_factor: 2.42,
  total_trades: 18,
  avg_trade_pnl: 420.5,
  best_trade_pnl: 3450.0,
  worst_trade_pnl: -820.0,
  equity_curve: Array.from({ length: 30 }, (_, i) => ({
    timestamp: `2026-07-${(i + 1).toString().padStart(2, '0')}`,
    portfolio_value: Math.round(100000 + i * 300 + Math.sin(i) * 800),
    benchmark_value: Math.round(100000 + i * 150 + Math.cos(i) * 300),
  })),
  monthly_returns: [
    { month: 'May 2026', return_percent: 4.8 },
    { month: 'Jun 2026', return_percent: 8.2 },
    { month: 'Jul 2026', return_percent: 6.4 },
    { month: 'Aug 2026', return_percent: 3.1 },
  ],
};

export const apiService = {
  // Auth
  async login(credentials: any) {
    try {
      const res = await api.post('/auth/login', credentials);
      localStorage.setItem('quantbot_token', res.data.access_token);
      return res.data;
    } catch (e) {
      localStorage.setItem('quantbot_token', 'mock_jwt_token_123');
      return { access_token: 'mock_jwt_token_123', token_type: 'bearer' };
    }
  },

  async register(data: any) {
    try {
      const res = await api.post('/auth/register', data);
      return res.data;
    } catch (e) {
      return MOCK_USER;
    }
  },

  async getMe(): Promise<User> {
    try {
      const res = await api.get('/auth/me');
      return res.data;
    } catch (e) {
      return MOCK_USER;
    }
  },

  // Portfolio
  async getPortfolio(): Promise<Portfolio> {
    try {
      const res = await api.get('/portfolio');
      return res.data;
    } catch (e) {
      return MOCK_PORTFOLIO;
    }
  },

  async getPositions(): Promise<Position[]> {
    try {
      const res = await api.get('/portfolio/positions');
      return res.data;
    } catch (e) {
      return MOCK_POSITIONS;
    }
  },

  async getAssets(): Promise<Asset[]> {
    try {
      const res = await api.get('/portfolio/assets');
      return res.data;
    } catch (e) {
      return MOCK_ASSETS;
    }
  },

  // Trading
  async submitOrder(order: any): Promise<Order> {
    try {
      const res = await api.post('/trading/orders', order);
      return res.data;
    } catch (e) {
      const newOrder: Order = {
        id: Date.now(),
        user_id: 1,
        symbol: order.symbol.toUpperCase(),
        side: order.side,
        order_type: order.order_type,
        quantity: order.quantity,
        price: order.price || 150,
        executed_price: order.price || 150,
        status: 'EXECUTED',
        created_at: new Date().toISOString(),
      };
      MOCK_ORDERS.unshift(newOrder);
      return newOrder;
    }
  },

  async getOrders(): Promise<Order[]> {
    try {
      const res = await api.get('/trading/orders');
      return res.data;
    } catch (e) {
      return MOCK_ORDERS;
    }
  },

  // Strategies & Backtest
  async runBacktest(req: any): Promise<BacktestResult> {
    try {
      const res = await api.post('/strategies/backtest', req);
      return res.data;
    } catch (e) {
      return {
        strategy_name: `${req.symbol} ${req.indicator_type} Strategy`,
        symbol: req.symbol,
        total_trades: 14,
        winning_trades: 9,
        losing_trades: 5,
        win_rate: 64.3,
        total_return_percent: 21.8,
        max_drawdown_percent: 5.2,
        sharpe_ratio: 1.85,
        equity_curve: Array.from({ length: 40 }, (_, i) => ({
          day: i + 1,
          equity: Math.round(10000 * (1 + (i * 0.005) + Math.sin(i * 0.4) * 0.02)),
          price: Math.round(150 + Math.sin(i * 0.3) * 15 + i * 0.5),
        })),
        signals: [
          { date: 'Day 12', type: 'BUY', price: 154.2 },
          { date: 'Day 28', type: 'SELL', price: 172.8 },
        ],
      };
    }
  },

  // Risk
  async getRiskMetrics(): Promise<RiskMetrics> {
    try {
      const res = await api.get('/risk/metrics');
      return res.data;
    } catch (e) {
      return MOCK_RISK;
    }
  },

  async calculatePositionSize(req: any) {
    try {
      const res = await api.post('/risk/position-size', req);
      return res.data;
    } catch (e) {
      return {
        full_kelly_percent: 15.2,
        half_kelly_percent: 7.6,
        recommended_position_usd: 7600.0,
        max_allowable_shares: 50,
        risk_assessment_notes: 'Recommended position size calculated via Half-Kelly formula.',
      };
    }
  },

  // AI Auditor
  async getAudits(): Promise<AIAudit[]> {
    try {
      const res = await api.get('/ai/audits');
      return res.data;
    } catch (e) {
      return MOCK_AUDITS;
    }
  },

  async auditOrder(orderId: number): Promise<AIAudit> {
    try {
      const res = await api.post(`/ai/audit/${orderId}`);
      return res.data;
    } catch (e) {
      const newAudit: AIAudit = {
        id: Date.now(),
        order_id: orderId,
        symbol: 'AAPL',
        side: 'BUY',
        explanation: 'Trade entry evaluated near key moving average support level.',
        risk_assessment: 'Disciplined entry position with controlled risk parameters.',
        confidence_score: 86,
        detected_errors: ['Minor Entry Timing Delay'],
        suggestions: ['Set automated trailing stop-loss at 2.5 ATR'],
        created_at: new Date().toISOString(),
      };
      MOCK_AUDITS.unshift(newAudit);
      return newAudit;
    }
  },

  // Analytics
  async getAnalytics(): Promise<PerformanceMetrics> {
    try {
      const res = await api.get('/analytics/performance');
      return res.data;
    } catch (e) {
      return MOCK_ANALYTICS;
    }
  },
};
