import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CurrencyProvider } from './context/CurrencyContext';
import { Sidebar } from './components/layout/Sidebar';
import { Navbar } from './components/layout/Navbar';
import { TradeModal } from './components/common/TradeModal';
import { DashboardPage } from './pages/DashboardPage';
import { TradingPage } from './pages/TradingPage';
import { StrategyLabPage } from './pages/StrategyLabPage';
import { RiskEnginePage } from './pages/RiskEnginePage';
import { AIAuditorPage } from './pages/AIAuditorPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { SettingsPage } from './pages/SettingsPage';
import { LoginPage } from './pages/LoginPage';
import { apiService } from './services/api';
import { Asset } from './types';

const ProtectedLayout: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();
  const [isTradeModalOpen, setIsTradeModalOpen] = useState(false);
  const [assets, setAssets] = useState<Asset[]>([]);

  useEffect(() => {
    if (isAuthenticated) {
      apiService.getAssets().then(setAssets).catch(console.error);
    }
  }, [isAuthenticated]);

  if (loading) {
    return (
      <div className="min-h-screen bg-quant-bg flex items-center justify-center font-mono text-xs text-quant-cyan">
        INITIALIZING QUANTBOT ENGINE...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex min-h-screen bg-quant-bg">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar onOpenTradeModal={() => setIsTradeModalOpen(true)} />
        <main className="p-6 flex-1 overflow-y-auto">
          <Routes>
            <Route path="/" element={<DashboardPage onOpenTradeModal={() => setIsTradeModalOpen(true)} />} />
            <Route path="/trading" element={<TradingPage />} />
            <Route path="/strategies" element={<StrategyLabPage />} />
            <Route path="/risk" element={<RiskEnginePage />} />
            <Route path="/ai-auditor" element={<AIAuditorPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>

      <TradeModal
        isOpen={isTradeModalOpen}
        onClose={() => setIsTradeModalOpen(false)}
        assets={assets}
        onOrderSuccess={() => window.location.reload()}
      />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <CurrencyProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/*" element={<ProtectedLayout />} />
          </Routes>
        </Router>
      </CurrencyProvider>
    </AuthProvider>
  );
};

export default App;
