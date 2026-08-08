import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  TrendingUp,
  FlaskConical,
  ShieldAlert,
  Bot,
  BarChart3,
  Settings,
  LogOut,
  Zap
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Sidebar: React.FC = () => {
  const { logout } = useAuth();

  const navItems = [
    { label: 'Dashboard', path: '/', icon: LayoutDashboard },
    { label: 'Trading Engine', path: '/trading', icon: TrendingUp },
    { label: 'Strategy Lab', path: '/strategies', icon: FlaskConical },
    { label: 'Risk Engine', path: '/risk', icon: ShieldAlert },
    { label: 'AI Trade Auditor', path: '/ai-auditor', icon: Bot, badge: 'Claude 3.5' },
    { label: 'Analytics', path: '/analytics', icon: BarChart3 },
    { label: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-quant-card border-r border-quant-border flex flex-col justify-between hidden md:flex min-h-screen sticky top-0">
      <div>
        {/* Brand Header */}
        <div className="h-16 flex items-center gap-3 px-6 border-b border-quant-border">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-quant-cyan to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Zap className="w-5 h-5 text-slate-950 font-bold" />
          </div>
          <div>
            <h1 className="font-bold text-lg tracking-wider text-slate-100 font-mono">QUANT<span className="text-quant-cyan">BOT</span></h1>
            <p className="text-[10px] text-quant-textMuted uppercase tracking-widest font-mono">Quant Platform v1.0</p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-4 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-quant-border text-quant-cyan border-l-4 border-quant-cyan font-semibold shadow-md'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] bg-quant-cyan/10 text-quant-cyan font-mono px-2 py-0.5 rounded border border-quant-cyan/30">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* System Status Footer */}
      <div className="p-4 border-t border-quant-border space-y-3">
        <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-slate-400 font-mono">Engine Status</span>
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
          </div>
          <p className="text-xs font-semibold text-emerald-400 font-mono">LIVE MARKET ACTIVE</p>
        </div>

        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
