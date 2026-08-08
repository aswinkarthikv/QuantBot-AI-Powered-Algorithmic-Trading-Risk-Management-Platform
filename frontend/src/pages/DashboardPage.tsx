import React, { useEffect, useState } from 'react';
import {
  DollarSign,
  TrendingUp,
  PieChart as PieIcon,
  ShieldCheck,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Plus
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { apiService } from '../services/api';
import { Portfolio, Position, Asset } from '../types';

interface DashboardPageProps {
  onOpenTradeModal: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onOpenTradeModal }) => {
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [positions, setPositions] = useState<Position[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [portData, posData, assetData] = await Promise.all([
        apiService.getPortfolio(),
        apiService.getPositions(),
        apiService.getAssets(),
      ]);
      setPortfolio(portData);
      setPositions(posData);
      setAssets(assetData);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const COLORS = ['#06B6D4', '#10B981', '#8B5CF6', '#F59E0B', '#3B82F6'];

  const chartData = [
    { day: 'Jul 01', value: 100000 },
    { day: 'Jul 07', value: 101200 },
    { day: 'Jul 14', value: 103500 },
    { day: 'Jul 21', value: 102800 },
    { day: 'Jul 28', value: 106400 },
    { day: 'Aug 04', value: 108450 },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-quant-border pb-4">
        <div>
          <h1 className="text-xl font-bold font-mono tracking-wide text-slate-100">PORTFOLIO DASHBOARD</h1>
          <p className="text-xs text-quant-textMuted font-mono">Real-time valuation, asset allocation & open positions</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchData}
            className="flex items-center gap-1.5 text-xs font-mono text-slate-400 hover:text-slate-200 bg-slate-900 px-3 py-2 rounded-lg border border-slate-800 transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>

          <button
            onClick={onOpenTradeModal}
            className="flex items-center gap-2 bg-quant-green hover:bg-emerald-400 text-slate-950 text-xs font-bold font-mono px-4 py-2 rounded-lg shadow-lg shadow-emerald-500/20 transition transform hover:-translate-y-0.5"
          >
            <Plus className="w-4 h-4" />
            <span>TRADE ASSET</span>
          </button>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Equity Card */}
        <div className="bg-quant-card border border-quant-border rounded-xl p-5 shadow-lg relative overflow-hidden">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-mono text-quant-textMuted uppercase">TOTAL PORTFOLIO VALUE</span>
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center text-quant-cyan">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold font-mono text-slate-100">
            ${portfolio?.total_equity.toLocaleString(undefined, { minimumFractionDigits: 2 }) || '108,450.00'}
          </p>
          <div className="flex items-center gap-1 mt-2 text-xs font-mono text-quant-green">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+${portfolio?.total_pnl.toLocaleString() || '8,450.00'} (+{portfolio?.total_pnl_percent.toFixed(2) || '8.45'}%)</span>
          </div>
        </div>

        {/* Cash Balance Card */}
        <div className="bg-quant-card border border-quant-border rounded-xl p-5 shadow-lg relative overflow-hidden">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-mono text-quant-textMuted uppercase">AVAILABLE CASH</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-quant-green">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold font-mono text-slate-100">
            ${portfolio?.cash_balance.toLocaleString(undefined, { minimumFractionDigits: 2 }) || '42,500.00'}
          </p>
          <p className="text-xs text-quant-textMuted font-mono mt-2">
            {(((portfolio?.cash_balance || 42500) / (portfolio?.total_equity || 108450)) * 100).toFixed(1)}% Buying Power
          </p>
        </div>

        {/* Realized P/L Card */}
        <div className="bg-quant-card border border-quant-border rounded-xl p-5 shadow-lg relative overflow-hidden">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-mono text-quant-textMuted uppercase">REALIZED P/L</span>
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-quant-purple">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold font-mono text-quant-green">
            +${portfolio?.realized_pnl.toLocaleString(undefined, { minimumFractionDigits: 2 }) || '4,177.50'}
          </p>
          <p className="text-xs text-quant-textMuted font-mono mt-2">Closed Positions Return</p>
        </div>

        {/* Unrealized P/L Card */}
        <div className="bg-quant-card border border-quant-border rounded-xl p-5 shadow-lg relative overflow-hidden">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-mono text-quant-textMuted uppercase">UNREALIZED P/L</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-quant-amber">
              <PieIcon className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold font-mono text-quant-green">
            +${portfolio?.unrealized_pnl.toLocaleString(undefined, { minimumFractionDigits: 2 }) || '4,272.50'}
          </p>
          <p className="text-xs text-quant-textMuted font-mono mt-2">Open Positions Floating P/L</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Equity Growth Chart */}
        <div className="lg:col-span-2 bg-quant-card border border-quant-border rounded-xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold font-mono text-slate-100">PORTFOLIO EQUITY TRAJECTORY</h2>
              <p className="text-xs text-quant-textMuted">Historical performance progression</p>
            </div>
            <span className="text-xs font-mono bg-quant-green/10 text-quant-green px-2.5 py-1 rounded border border-quant-green/20">
              ALL TIME +8.45%
            </span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorEquity" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#06B6D4" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="#475569" fontSize={11} tickLine={false} />
                <YAxis stroke="#475569" fontSize={11} tickLine={false} domain={['dataMin - 2000', 'dataMax + 2000']} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#111827', borderColor: '#1F293D', borderRadius: '8px', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="value" stroke="#06B6D4" strokeWidth={2} fillOpacity={1} fill="url(#colorEquity)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Asset Allocation Pie Chart */}
        <div className="bg-quant-card border border-quant-border rounded-xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold font-mono text-slate-100 mb-1">ASSET ALLOCATION</h2>
            <p className="text-xs text-quant-textMuted mb-4">Portfolio capital distribution</p>

            <div className="h-44 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={portfolio?.allocations || []}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {(portfolio?.allocations || []).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#111827', borderColor: '#1F293D', borderRadius: '8px', fontSize: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-1.5 pt-3 border-t border-quant-border">
            {(portfolio?.allocations || []).slice(0, 4).map((item, idx) => (
              <div key={item.category} className="flex justify-between items-center text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></span>
                  <span className="text-slate-300">{item.category}</span>
                </div>
                <span className="text-slate-100 font-semibold">{item.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Active Positions Table */}
      <div className="bg-quant-card border border-quant-border rounded-xl p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold font-mono text-slate-100">ACTIVE POSITIONS</h2>
          <span className="text-xs text-quant-textMuted font-mono">{positions.length} Open Tranches</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="border-b border-quant-border text-quant-textMuted uppercase">
                <th className="pb-3 font-semibold">Asset</th>
                <th className="pb-3 font-semibold">Quantity</th>
                <th className="pb-3 font-semibold">Avg Entry</th>
                <th className="pb-3 font-semibold">Current Price</th>
                <th className="pb-3 font-semibold">Market Value</th>
                <th className="pb-3 font-semibold">Unrealized P/L</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-quant-border">
              {positions.map((pos) => {
                const isPositive = pos.unrealized_pnl >= 0;
                return (
                  <tr key={pos.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3 font-bold text-slate-100 flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-quant-cyan border border-slate-700">
                        {pos.symbol}
                      </span>
                    </td>
                    <td className="py-3 text-slate-300">{pos.quantity}</td>
                    <td className="py-3 text-slate-300">${pos.avg_entry_price.toFixed(2)}</td>
                    <td className="py-3 text-slate-200 font-semibold">${pos.current_price.toFixed(2)}</td>
                    <td className="py-3 text-slate-100 font-bold">${pos.total_value.toLocaleString()}</td>
                    <td className="py-3 font-bold">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded ${
                          isPositive
                            ? 'bg-quant-green/10 text-quant-green border border-quant-green/20'
                            : 'bg-quant-red/10 text-quant-red border border-quant-red/20'
                        }`}
                      >
                        {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                        ${pos.unrealized_pnl.toFixed(2)} ({isPositive ? '+' : ''}{pos.unrealized_pnl_percent}%)
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
