import React, { useState } from 'react';
import { FlaskConical, Play, Award, ArrowUpRight, CheckCircle, BarChart2 } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { apiService } from '../services/api';
import { BacktestResult } from '../types';

export const StrategyLabPage: React.FC = () => {
  const [symbol, setSymbol] = useState('AAPL');
  const [indicatorType, setIndicatorType] = useState<'RSI' | 'SMA' | 'EMA' | 'MACD' | 'BOLLINGER'>('RSI');
  const [period, setPeriod] = useState(14);
  const [oversold, setOversold] = useState(30);
  const [overbought, setOverbought] = useState(70);
  const [initialCapital, setInitialCapital] = useState(10000);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<BacktestResult | null>(null);

  const handleRunBacktest = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const backtestRes = await apiService.runBacktest({
        symbol,
        indicator_type: indicatorType,
        period,
        oversold,
        overbought,
        initial_capital: initialCapital,
      });
      setResult(backtestRes);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-quant-border pb-4">
        <h1 className="text-xl font-bold font-mono tracking-wide text-slate-100">STRATEGY LAB & BACKTESTER</h1>
        <p className="text-xs text-quant-textMuted font-mono">
          Quantitative indicator backtesting engine (SMA, EMA, RSI, MACD, Bollinger Bands)
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Backtest Configurator Panel */}
        <div className="bg-quant-card border border-quant-border rounded-xl p-6 shadow-xl space-y-5">
          <div className="flex items-center gap-2 border-b border-quant-border pb-3">
            <FlaskConical className="w-5 h-5 text-quant-cyan" />
            <h2 className="text-sm font-bold font-mono text-slate-100">STRATEGY CONFIGURATOR</h2>
          </div>

          <form onSubmit={handleRunBacktest} className="space-y-4 font-mono text-xs">
            <div>
              <label className="block text-slate-400 mb-1">TARGET ASSET</label>
              <select
                value={symbol}
                onChange={(e) => setSymbol(e.target.value)}
                className="w-full bg-slate-900 border border-quant-border rounded-lg px-3 py-2 text-slate-100 focus:border-quant-cyan"
              >
                <option value="AAPL">AAPL (Apple Inc.)</option>
                <option value="NVDA">NVDA (NVIDIA)</option>
                <option value="TSLA">TSLA (Tesla)</option>
                <option value="BTC/USD">BTC/USD (Bitcoin)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">INDICATOR ENGINE</label>
              <select
                value={indicatorType}
                onChange={(e) => setIndicatorType(e.target.value as any)}
                className="w-full bg-slate-900 border border-quant-border rounded-lg px-3 py-2 text-slate-100 focus:border-quant-cyan"
              >
                <option value="RSI">RSI (Relative Strength Index)</option>
                <option value="SMA">SMA (Simple Moving Average)</option>
                <option value="EMA">EMA (Exponential Moving Average)</option>
                <option value="MACD">MACD (Convergence Divergence)</option>
                <option value="BOLLINGER">Bollinger Bands Breakout</option>
              </select>
            </div>

            {indicatorType === 'RSI' && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 mb-1">LOOKBACK PERIOD</label>
                    <input
                      type="number"
                      value={period}
                      onChange={(e) => setPeriod(parseInt(e.target.value) || 14)}
                      className="w-full bg-slate-900 border border-quant-border rounded-lg px-3 py-2 text-slate-100"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">INITIAL CAPITAL ($)</label>
                    <input
                      type="number"
                      value={initialCapital}
                      onChange={(e) => setInitialCapital(parseFloat(e.target.value) || 10000)}
                      className="w-full bg-slate-900 border border-quant-border rounded-lg px-3 py-2 text-slate-100"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 mb-1">OVERSOLD (&lt; Threshold)</label>
                    <input
                      type="number"
                      value={oversold}
                      onChange={(e) => setOversold(parseInt(e.target.value) || 30)}
                      className="w-full bg-slate-900 border border-quant-border rounded-lg px-3 py-2 text-slate-100"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">OVERBOUGHT (&gt; Threshold)</label>
                    <input
                      type="number"
                      value={overbought}
                      onChange={(e) => setOverbought(parseInt(e.target.value) || 70)}
                      className="w-full bg-slate-900 border border-quant-border rounded-lg px-3 py-2 text-slate-100"
                    />
                  </div>
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-quant-cyan to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold py-3 rounded-lg text-xs tracking-wider transition shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4" />
              <span>{loading ? 'SIMULATING BACKTEST...' : 'EXECUTE BACKTEST'}</span>
            </button>
          </form>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-2 space-y-6">
          {result ? (
            <>
              {/* Performance Stats Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-quant-card border border-quant-border rounded-xl p-4">
                  <span className="text-[11px] font-mono text-quant-textMuted uppercase">WIN RATE</span>
                  <p className="text-xl font-bold font-mono text-quant-green mt-1">{result.win_rate}%</p>
                  <p className="text-[10px] font-mono text-slate-400 mt-1">{result.winning_trades}/{result.total_trades} Trades</p>
                </div>

                <div className="bg-quant-card border border-quant-border rounded-xl p-4">
                  <span className="text-[11px] font-mono text-quant-textMuted uppercase">TOTAL RETURN</span>
                  <p className="text-xl font-bold font-mono text-quant-cyan mt-1">+{result.total_return_percent}%</p>
                  <p className="text-[10px] font-mono text-slate-400 mt-1">Over 120 Days</p>
                </div>

                <div className="bg-quant-card border border-quant-border rounded-xl p-4">
                  <span className="text-[11px] font-mono text-quant-textMuted uppercase">MAX DRAWDOWN</span>
                  <p className="text-xl font-bold font-mono text-quant-red mt-1">-{result.max_drawdown_percent}%</p>
                  <p className="text-[10px] font-mono text-slate-400 mt-1">Peak-to-Trough</p>
                </div>

                <div className="bg-quant-card border border-quant-border rounded-xl p-4">
                  <span className="text-[11px] font-mono text-quant-textMuted uppercase">SHARPE RATIO</span>
                  <p className="text-xl font-bold font-mono text-quant-purple mt-1">{result.sharpe_ratio}</p>
                  <p className="text-[10px] font-mono text-slate-400 mt-1">Risk Adjusted</p>
                </div>
              </div>

              {/* Equity Curve Chart */}
              <div className="bg-quant-card border border-quant-border rounded-xl p-6 shadow-xl">
                <h3 className="text-sm font-bold font-mono text-slate-100 mb-4">BACKTEST EQUITY PROGRESSION</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={result.equity_curve}>
                      <XAxis dataKey="day" stroke="#475569" fontSize={11} />
                      <YAxis stroke="#475569" fontSize={11} domain={['auto', 'auto']} />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#111827', borderColor: '#1F293D', borderRadius: '8px', fontSize: '12px' }}
                      />
                      <Legend />
                      <Line type="monotone" dataKey="equity" stroke="#06B6D4" strokeWidth={2} name="Strategy Equity ($)" dot={false} />
                      <Line type="monotone" dataKey="price" stroke="#64748B" strokeWidth={1} name="Asset Price ($)" dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-quant-card border border-quant-border rounded-xl p-12 text-center text-quant-textMuted font-mono space-y-3">
              <BarChart2 className="w-12 h-12 text-slate-700 mx-auto" />
              <p className="text-sm font-semibold text-slate-300">NO BACKTEST SIMULATION EXECUTED YET</p>
              <p className="text-xs">Configure strategy parameters on the left and click "Execute Backtest"</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
