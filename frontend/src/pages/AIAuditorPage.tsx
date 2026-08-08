import React, { useState, useEffect } from 'react';
import { Bot, CheckCircle2, AlertOctagon, Lightbulb, Sparkles, RefreshCw } from 'lucide-react';
import { apiService } from '../services/api';
import { AIAudit } from '../types';

export const AIAuditorPage: React.FC = () => {
  const [audits, setAudits] = useState<AIAudit[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAudits = async () => {
    setLoading(true);
    try {
      const data = await apiService.getAudits();
      setAudits(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAudits();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-quant-border pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold font-mono tracking-wide text-slate-100">AI TRADE AUDITOR</h1>
            <span className="bg-quant-cyan/10 text-quant-cyan border border-quant-cyan/30 text-[10px] font-mono px-2 py-0.5 rounded">
              POWERED BY CLAUDE 3.5 SONNET
            </span>
          </div>
          <p className="text-xs text-quant-textMuted font-mono">
            Automated trade rationale evaluation, psychological error detection & tactical optimization
          </p>
        </div>

        <button
          onClick={fetchAudits}
          className="flex items-center gap-1.5 text-xs font-mono text-slate-400 hover:text-slate-200 bg-slate-900 px-3 py-2 rounded-lg border border-slate-800 transition"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh Audits
        </button>
      </div>

      {/* Audit Feed Cards */}
      <div className="space-y-6">
        {audits.map((audit) => (
          <div
            key={audit.id}
            className="bg-quant-card border border-quant-border rounded-xl p-6 shadow-xl relative overflow-hidden space-y-5"
          >
            {/* Header / Trade Symbol & Confidence Score */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-quant-border pb-4">
              <div className="flex items-center gap-3 font-mono">
                <div className="w-10 h-10 rounded-lg bg-quant-cyan/10 border border-quant-cyan/30 flex items-center justify-center text-quant-cyan">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold text-slate-100">{audit.symbol}</span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded font-bold ${
                        audit.side === 'BUY' ? 'bg-quant-green/10 text-quant-green' : 'bg-quant-red/10 text-quant-red'
                      }`}
                    >
                      {audit.side} ORDER
                    </span>
                    <span className="text-xs text-quant-textMuted">Order #{audit.order_id}</span>
                  </div>
                  <p className="text-[11px] text-quant-textMuted">{new Date(audit.created_at).toLocaleString()}</p>
                </div>
              </div>

              {/* Confidence Score Pill */}
              <div className="flex items-center gap-2 font-mono bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
                <Sparkles className="w-4 h-4 text-quant-cyan" />
                <span className="text-xs text-slate-400">AI Confidence Score:</span>
                <span className="text-sm font-bold text-quant-cyan">{audit.confidence_score}%</span>
              </div>
            </div>

            {/* Explanation & Risk Assessment Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
              <div className="bg-slate-900/70 p-4 rounded-lg border border-slate-800 space-y-1.5">
                <h3 className="text-quant-cyan font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> TRADE RATIONALE & EXPLANATION
                </h3>
                <p className="text-slate-300 leading-relaxed">{audit.explanation}</p>
              </div>

              <div className="bg-slate-900/70 p-4 rounded-lg border border-slate-800 space-y-1.5">
                <h3 className="text-quant-purple font-bold flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" /> RISK EVALUATION
                </h3>
                <p className="text-slate-300 leading-relaxed">{audit.risk_assessment}</p>
              </div>
            </div>

            {/* Detected Errors & Tactical Suggestions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
              {/* Detected Errors */}
              <div className="bg-red-500/5 p-4 rounded-lg border border-red-500/20 space-y-2">
                <h4 className="text-quant-red font-bold flex items-center gap-1.5">
                  <AlertOctagon className="w-4 h-4" /> DETECTED TRADER ERRORS
                </h4>
                <ul className="space-y-1 text-slate-300 list-disc list-inside">
                  {audit.detected_errors.map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
              </div>

              {/* Suggestions */}
              <div className="bg-emerald-500/5 p-4 rounded-lg border border-emerald-500/20 space-y-2">
                <h4 className="text-quant-green font-bold flex items-center gap-1.5">
                  <Lightbulb className="w-4 h-4" /> TACTICAL IMPROVEMENTS
                </h4>
                <ul className="space-y-1 text-slate-300 list-disc list-inside">
                  {audit.suggestions.map((sug, i) => (
                    <li key={i}>{sug}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
