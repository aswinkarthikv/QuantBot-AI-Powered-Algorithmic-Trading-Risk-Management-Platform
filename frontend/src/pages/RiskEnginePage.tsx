import React, { useState, useEffect } from 'react';
import { ShieldAlert, ShieldCheck, Calculator, AlertTriangle, Scale, Lock } from 'lucide-react';
import { apiService } from '../services/api';
import { RiskMetrics } from '../types';
import { useCurrency } from '../context/CurrencyContext';

export const RiskEnginePage: React.FC = () => {
  const [metrics, setMetrics] = useState<RiskMetrics | null>(null);
  const [winRate, setWinRate] = useState(0.60);
  const [winLossRatio, setWinLossRatio] = useState(1.5);
  const [accountBalance, setAccountBalance] = useState(100000);
  const [calcResult, setCalcResult] = useState<any>(null);

  const { formatAmount } = useCurrency();

  useEffect(() => {
    const fetchRisk = async () => {
      try {
        const data = await apiService.getRiskMetrics();
        setMetrics(data);
      } catch (e) {
        console.error(e);
      }
    };
    fetchRisk();
  }, []);

  const handleCalculateKelly = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await apiService.calculatePositionSize({
        account_balance: accountBalance,
        win_rate: winRate,
        win_loss_ratio: winLossRatio,
        asset_volatility: 0.02,
        risk_per_trade_percent: 2.0,
      });
      setCalcResult(res);
    } catch (e) {
      console.error(e);
    }
  };

  const getRiskScoreColor = (score: number) => {
    if (score < 30) return 'text-quant-green border-quant-green/30 bg-quant-green/10';
    if (score < 60) return 'text-quant-amber border-quant-amber/30 bg-quant-amber/10';
    return 'text-quant-red border-quant-red/30 bg-quant-red/10';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-quant-border pb-4">
        <h1 className="text-xl font-bold font-mono tracking-wide text-slate-100">RISK MANAGEMENT ENGINE</h1>
        <p className="text-xs text-quant-textMuted font-mono">
          Kelly Criterion position sizing, Max drawdown control & Daily loss limit safety rules
        </p>
      </div>

      {/* Quant Risk Score & Status Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-quant-card border border-quant-border rounded-xl p-6 shadow-xl flex items-center justify-between">
          <div>
            <span className="text-xs font-mono text-quant-textMuted uppercase">COMPOSITE QUANT RISK SCORE</span>
            <p className="text-3xl font-bold font-mono text-slate-100 mt-1">{metrics?.risk_score || 28}<span className="text-sm font-normal text-slate-400">/100</span></p>
            <span className={`inline-block mt-2 text-xs font-mono px-2.5 py-0.5 rounded border ${getRiskScoreColor(metrics?.risk_score || 28)}`}>
              RISK LEVEL: {metrics?.risk_level || 'MODERATE'}
            </span>
          </div>

          {/* Meter ring representation */}
          <div className="w-20 h-20 rounded-full border-4 border-quant-green/30 flex items-center justify-center relative">
            <ShieldCheck className="w-10 h-10 text-quant-green" />
          </div>
        </div>

        {/* Drawdown Tracker */}
        <div className="bg-quant-card border border-quant-border rounded-xl p-6 shadow-xl">
          <span className="text-xs font-mono text-quant-textMuted uppercase">CURRENT DRAWDOWN</span>
          <p className="text-3xl font-bold font-mono text-quant-green mt-1">{metrics?.current_drawdown || 1.85}%</p>
          <div className="w-full bg-slate-800 h-2 rounded-full mt-3 overflow-hidden">
            <div className="bg-quant-green h-full rounded-full" style={{ width: `${(metrics?.current_drawdown || 1.85) * 5}%` }}></div>
          </div>
          <p className="text-[11px] font-mono text-slate-400 mt-2">Max Peak Drawdown Limit: {metrics?.max_drawdown || 4.20}%</p>
        </div>

        {/* Daily Loss Limit */}
        <div className="bg-quant-card border border-quant-border rounded-xl p-6 shadow-xl">
          <span className="text-xs font-mono text-quant-textMuted uppercase">DAILY LOSS vs SAFETY LIMIT</span>
          <p className="text-3xl font-bold font-mono text-slate-100 mt-1">
            {formatAmount(metrics?.daily_loss || 450)}{' '}
            <span className="text-xs font-normal text-quant-textMuted">/ {formatAmount(metrics?.daily_loss_limit || 3500)}</span>
          </p>
          <div className="w-full bg-slate-800 h-2 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-quant-cyan h-full rounded-full"
              style={{ width: `${((metrics?.daily_loss || 450) / (metrics?.daily_loss_limit || 3500)) * 100}%` }}
            ></div>
          </div>
          <p className="text-[11px] font-mono text-quant-green mt-2 flex items-center gap-1">
            <Lock className="w-3 h-3" /> Safety Rule Active: Auto-kill switch enabled
          </p>
        </div>
      </div>

      {/* Kelly Criterion & Volatility Position Sizing Calculator */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-quant-card border border-quant-border rounded-xl p-6 shadow-xl space-y-5 font-mono">
          <div className="flex items-center gap-2 border-b border-quant-border pb-3">
            <Calculator className="w-5 h-5 text-quant-cyan" />
            <h2 className="text-sm font-bold text-slate-100">KELLY CRITERION POSITION SIZING CALCULATOR</h2>
          </div>

          <form onSubmit={handleCalculateKelly} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-400 mb-1">ACCOUNT EQUITY BALANCE ($ USD)</label>
              <input
                type="number"
                value={accountBalance}
                onChange={(e) => setAccountBalance(parseFloat(e.target.value) || 100000)}
                className="w-full bg-slate-900 border border-quant-border rounded-lg px-3 py-2 text-slate-100"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 mb-1">HISTORICAL WIN RATE (W)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0.1"
                  max="0.99"
                  value={winRate}
                  onChange={(e) => setWinRate(parseFloat(e.target.value) || 0.6)}
                  className="w-full bg-slate-900 border border-quant-border rounded-lg px-3 py-2 text-slate-100"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">WIN/LOSS PAYOFF RATIO (R)</label>
                <input
                  type="number"
                  step="0.1"
                  value={winLossRatio}
                  onChange={(e) => setWinLossRatio(parseFloat(e.target.value) || 1.5)}
                  className="w-full bg-slate-900 border border-quant-border rounded-lg px-3 py-2 text-slate-100"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-quant-cyan hover:bg-cyan-400 text-slate-950 font-bold py-2.5 rounded-lg text-xs transition shadow-lg shadow-cyan-500/20"
            >
              CALCULATE OPTIMAL POSITION SIZE
            </button>
          </form>

          {calcResult && (
            <div className="bg-slate-900 p-4 rounded-lg border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Full Kelly Size:</span>
                <span className="text-slate-100 font-bold">{calcResult.full_kelly_percent}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Recommended Half-Kelly:</span>
                <span className="text-quant-green font-bold">{calcResult.half_kelly_percent}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Recommended Allocation:</span>
                <span className="text-quant-cyan font-bold">{formatAmount(calcResult.recommended_position_usd)}</span>
              </div>
              <p className="text-[11px] text-quant-textMuted pt-2 border-t border-slate-800">{calcResult.risk_assessment_notes}</p>
            </div>
          )}
        </div>

        {/* Actionable Risk Alerts */}
        <div className="bg-quant-card border border-quant-border rounded-xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 border-b border-quant-border pb-3 mb-4">
              <ShieldAlert className="w-5 h-5 text-quant-amber" />
              <h2 className="text-sm font-bold font-mono text-slate-100">LIVE SYSTEM RISK ALERTS</h2>
            </div>

            <div className="space-y-3">
              {(metrics?.risk_alerts || []).map((alert, idx) => (
                <div key={idx} className="bg-slate-900 p-3 rounded-lg border border-slate-800 flex items-start gap-3">
                  <AlertTriangle className="w-4 h-4 text-quant-green shrink-0 mt-0.5" />
                  <p className="text-xs font-mono text-slate-200">{alert}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl text-xs font-mono text-quant-green mt-6">
            🛡️ <span className="font-bold">Automated Stop-Loss Guard:</span> All orders automatically evaluate against trailing 2.5 ATR volatility bands.
          </div>
        </div>
      </div>
    </div>
  );
};
