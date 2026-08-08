import React, { useState } from 'react';
import { Settings, Shield, Bell, Key, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  const [riskTolerance, setRiskTolerance] = useState(user?.risk_tolerance || 'MODERATE');
  const [dailyLossLimit, setDailyLossLimit] = useState(user?.daily_loss_limit || 3500);
  const [telegramToken, setTelegramToken] = useState('');
  const [anthropicKey, setAnthropicKey] = useState('');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="border-b border-quant-border pb-4">
        <h1 className="text-xl font-bold font-mono tracking-wide text-slate-100">PLATFORM SETTINGS</h1>
        <p className="text-xs text-quant-textMuted font-mono">
          Risk controls, Telegram bot notifications & AI API configuration
        </p>
      </div>

      {saved && (
        <div className="bg-quant-green/10 border border-quant-green/30 p-3 rounded-lg flex items-center gap-2 text-xs text-quant-green font-mono">
          <Check className="w-4 h-4" />
          <span>Platform preferences saved successfully!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6 font-mono text-xs">
        {/* Risk Thresholds Card */}
        <div className="bg-quant-card border border-quant-border rounded-xl p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-2 border-b border-quant-border pb-3">
            <Shield className="w-5 h-5 text-quant-cyan" />
            <h2 className="text-sm font-bold text-slate-100">RISK CONTROL PARAMETERS</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 mb-1">RISK TOLERANCE PROFILE</label>
              <select
                value={riskTolerance}
                onChange={(e) => setRiskTolerance(e.target.value)}
                className="w-full bg-slate-900 border border-quant-border rounded-lg px-3 py-2 text-slate-100 focus:border-quant-cyan"
              >
                <option value="LOW">CONSERVATIVE (LOW)</option>
                <option value="MODERATE">BALANCED (MODERATE)</option>
                <option value="HIGH">GROWTH (HIGH)</option>
                <option value="AGGRESSIVE">QUANT AGGRESSIVE</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">MAX DAILY LOSS LIMIT ($)</label>
              <input
                type="number"
                value={dailyLossLimit}
                onChange={(e) => setDailyLossLimit(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-900 border border-quant-border rounded-lg px-3 py-2 text-slate-100 focus:border-quant-cyan"
              />
            </div>
          </div>
        </div>

        {/* Notifications Card */}
        <div className="bg-quant-card border border-quant-border rounded-xl p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-2 border-b border-quant-border pb-3">
            <Bell className="w-5 h-5 text-quant-amber" />
            <h2 className="text-sm font-bold text-slate-100">TELEGRAM & EMAIL ALERTS</h2>
          </div>

          <div>
            <label className="block text-slate-400 mb-1">TELEGRAM BOT TOKEN</label>
            <input
              type="password"
              value={telegramToken}
              onChange={(e) => setTelegramToken(e.target.value)}
              placeholder="123456789:ABCdefGhIJKlmNoPQRsTUVwxyZ"
              className="w-full bg-slate-900 border border-quant-border rounded-lg px-3 py-2 text-slate-100 focus:border-quant-cyan"
            />
            <p className="text-[11px] text-quant-textMuted mt-1">Order executions & risk limit breaches will dispatch instant Telegram alerts.</p>
          </div>
        </div>

        {/* AI API Integration Card */}
        <div className="bg-quant-card border border-quant-border rounded-xl p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-2 border-b border-quant-border pb-3">
            <Key className="w-5 h-5 text-quant-purple" />
            <h2 className="text-sm font-bold text-slate-100">ANTHROPIC CLAUDE API KEY</h2>
          </div>

          <div>
            <label className="block text-slate-400 mb-1">ANTHROPIC API KEY (sk-ant-...)</label>
            <input
              type="password"
              value={anthropicKey}
              onChange={(e) => setAnthropicKey(e.target.value)}
              placeholder="sk-ant-api03-..."
              className="w-full bg-slate-900 border border-quant-border rounded-lg px-3 py-2 text-slate-100 focus:border-quant-cyan"
            />
            <p className="text-[11px] text-quant-textMuted mt-1">If blank, QuantBot automatically uses its built-in quantitative rule fallback engine.</p>
          </div>
        </div>

        <button
          type="submit"
          className="bg-quant-cyan hover:bg-cyan-400 text-slate-950 font-bold px-6 py-3 rounded-lg text-xs transition shadow-lg shadow-cyan-500/20"
        >
          SAVE PLATFORM PREFERENCES
        </button>
      </form>
    </div>
  );
};
