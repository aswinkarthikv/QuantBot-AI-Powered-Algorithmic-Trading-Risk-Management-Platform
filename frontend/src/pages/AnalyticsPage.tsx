import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Award, Activity, Calendar } from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { apiService } from '../services/api';
import { PerformanceMetrics } from '../types';
import { useCurrency } from '../context/CurrencyContext';

export const AnalyticsPage: React.FC = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const { exchangeRate, currencySymbol } = useCurrency();

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const data = await apiService.getAnalytics();
        setMetrics(data);
      } catch (e) {
        console.error(e);
      }
    };
    fetchAnalytics();
  }, []);

  const convertedEquityCurve = (metrics?.equity_curve || []).map((pt) => ({
    timestamp: pt.timestamp,
    portfolio_value: Math.round(pt.portfolio_value * exchangeRate),
    benchmark_value: Math.round(pt.benchmark_value * exchangeRate),
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-quant-border pb-4">
        <h1 className="text-xl font-bold font-mono tracking-wide text-slate-100">QUANTITATIVE ANALYTICS</h1>
        <p className="text-xs text-quant-textMuted font-mono">
          Sharpe ratio, Sortino ratio, CAGR, equity curve vs SPY benchmark & monthly returns matrix
        </p>
      </div>

      {/* Primary Quantitative Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 font-mono">
        <div className="bg-quant-card border border-quant-border rounded-xl p-4 text-center">
          <span className="text-[10px] text-quant-textMuted uppercase">TOTAL RETURN</span>
          <p className="text-lg font-bold text-quant-green mt-1">+{metrics?.total_return_percent || 8.45}%</p>
        </div>

        <div className="bg-quant-card border border-quant-border rounded-xl p-4 text-center">
          <span className="text-[10px] text-quant-textMuted uppercase">CAGR</span>
          <p className="text-lg font-bold text-quant-cyan mt-1">{metrics?.cagr || 24.5}%</p>
        </div>

        <div className="bg-quant-card border border-quant-border rounded-xl p-4 text-center">
          <span className="text-[10px] text-quant-textMuted uppercase">SHARPE RATIO</span>
          <p className="text-lg font-bold text-quant-purple mt-1">{metrics?.sharpe_ratio || 2.15}</p>
        </div>

        <div className="bg-quant-card border border-quant-border rounded-xl p-4 text-center">
          <span className="text-[10px] text-quant-textMuted uppercase">SORTINO RATIO</span>
          <p className="text-lg font-bold text-quant-cyan mt-1">{metrics?.sortino_ratio || 2.85}</p>
        </div>

        <div className="bg-quant-card border border-quant-border rounded-xl p-4 text-center">
          <span className="text-[10px] text-quant-textMuted uppercase">WIN RATE</span>
          <p className="text-lg font-bold text-quant-green mt-1">{metrics?.win_rate || 68.5}%</p>
        </div>

        <div className="bg-quant-card border border-quant-border rounded-xl p-4 text-center">
          <span className="text-[10px] text-quant-textMuted uppercase">PROFIT FACTOR</span>
          <p className="text-lg font-bold text-quant-green mt-1">{metrics?.profit_factor || 2.42}</p>
        </div>

        <div className="bg-quant-card border border-quant-border rounded-xl p-4 text-center col-span-2 sm:col-span-1">
          <span className="text-[10px] text-quant-textMuted uppercase">MAX DRAWDOWN</span>
          <p className="text-lg font-bold text-quant-red mt-1">-{metrics?.max_drawdown || 4.2}%</p>
        </div>
      </div>

      {/* Equity vs Benchmark SPY Area Chart */}
      <div className="bg-quant-card border border-quant-border rounded-xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold font-mono text-slate-100">EQUITY CURVE vs S&P 500 BENCHMARK (SPY) ({currencySymbol})</h2>
            <p className="text-xs text-quant-textMuted font-mono">Alpha generation trajectory</p>
          </div>
          <span className="text-xs font-mono bg-quant-cyan/10 text-quant-cyan px-2.5 py-1 rounded border border-quant-cyan/20">
            ALPHA: +4.25% OVER SPY
          </span>
        </div>

        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={convertedEquityCurve}>
              <defs>
                <linearGradient id="colorQuant" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="timestamp" stroke="#475569" fontSize={11} />
              <YAxis stroke="#475569" fontSize={11} domain={['dataMin - 10000', 'dataMax + 10000']} />
              <Tooltip
                contentStyle={{ backgroundColor: '#111827', borderColor: '#1F293D', borderRadius: '8px', fontSize: '12px' }}
              />
              <Legend />
              <Area type="monotone" dataKey="portfolio_value" stroke="#10B981" strokeWidth={2} name={`QuantBot Equity (${currencySymbol})`} fill="url(#colorQuant)" />
              <Area type="monotone" dataKey="benchmark_value" stroke="#64748B" strokeWidth={1} name={`SPY Benchmark (${currencySymbol})`} fill="transparent" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Monthly Return Matrix */}
      <div className="bg-quant-card border border-quant-border rounded-xl p-6 shadow-xl space-y-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-quant-cyan" />
          <h2 className="text-sm font-bold font-mono text-slate-100">MONTHLY PERFORMANCE BREAKDOWN (2026)</h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-xs">
          {(metrics?.monthly_returns || []).map((m) => (
            <div key={m.month} className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex justify-between items-center">
              <span className="text-slate-400 font-semibold">{m.month}</span>
              <span className="text-quant-green font-bold">+{m.return_percent}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
