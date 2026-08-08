import React from 'react';
import { Bell, User as UserIcon, Activity, PlusCircle, Globe } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCurrency } from '../../context/CurrencyContext';

interface NavbarProps {
  onOpenTradeModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenTradeModal }) => {
  const { user } = useAuth();
  const { currency, toggleCurrency, formatAmount } = useCurrency();

  return (
    <header className="h-16 bg-quant-card border-b border-quant-border px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Live Market Ticker Banner */}
      <div className="flex items-center gap-6 overflow-hidden">
        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <Activity className="w-4 h-4 text-quant-cyan animate-pulse" />
          <span className="hidden sm:inline">LIVE FEED:</span>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">AAPL</span>
            <span className="text-slate-200">{formatAmount(224.5)}</span>
            <span className="text-quant-green">+1.85%</span>
          </div>
          <div className="hidden sm:flex items-center gap-1.5">
            <span className="text-slate-400">NVDA</span>
            <span className="text-slate-200">{formatAmount(128.4)}</span>
            <span className="text-quant-green">+4.12%</span>
          </div>
          <div className="hidden md:flex items-center gap-1.5">
            <span className="text-slate-400">BTC/USD</span>
            <span className="text-slate-200">{formatAmount(64250)}</span>
            <span className="text-quant-green">+3.45%</span>
          </div>
        </div>
      </div>

      {/* Action Controls, Currency Switcher & User Profile */}
      <div className="flex items-center gap-3">
        {/* USD / INR Currency Switch Toggle */}
        <button
          onClick={toggleCurrency}
          className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 border border-quant-cyan/40 px-3 py-1.5 rounded-lg text-xs font-mono font-bold text-quant-cyan shadow-md transition transform hover:scale-105"
          title="Switch Currency between USD ($) and INR (₹)"
        >
          <Globe className="w-3.5 h-3.5" />
          <span>{currency === 'USD' ? '🇺🇸 USD ($)' : '🇮🇳 INR (₹)'}</span>
        </button>

        {onOpenTradeModal && (
          <button
            onClick={onOpenTradeModal}
            className="flex items-center gap-2 bg-gradient-to-r from-quant-green to-emerald-600 hover:from-emerald-500 hover:to-emerald-700 text-slate-950 text-xs font-bold px-3.5 py-2 rounded-lg shadow-lg shadow-emerald-500/20 transition transform hover:-translate-y-0.5 font-mono"
          >
            <PlusCircle className="w-4 h-4" />
            <span className="hidden sm:inline">New Order</span>
          </button>
        )}

        <div className="h-6 w-px bg-quant-border mx-1 hidden sm:block" />

        {/* Notifications Icon */}
        <button className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg relative transition">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-quant-cyan rounded-full"></span>
        </button>

        {/* User Info */}
        <div className="flex items-center gap-2.5 pl-2">
          <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-quant-cyan font-bold text-xs">
            <UserIcon className="w-4 h-4" />
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-xs font-semibold text-slate-200">{user?.full_name || 'Alex Mercer'}</p>
            <p className="text-[10px] text-quant-textMuted font-mono">{user?.risk_tolerance || 'MODERATE'} RISK</p>
          </div>
        </div>
      </div>
    </header>
  );
};
