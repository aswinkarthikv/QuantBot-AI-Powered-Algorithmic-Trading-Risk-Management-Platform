import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Bot,
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { apiService } from '../services/api';
import { Asset, Order } from '../types';

export const TradingPage: React.FC = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedSymbol, setSelectedSymbol] = useState('AAPL');
  const [side, setSide] = useState<'BUY' | 'SELL'>('BUY');
  const [orderType, setOrderType] = useState<'MARKET' | 'LIMIT'>('MARKET');
  const [quantity, setQuantity] = useState(10);
  const [limitPrice, setLimitPrice] = useState(224.5);
  const [loading, setLoading] = useState(false);
  const [auditingOrderId, setAuditingOrderId] = useState<number | null>(null);
  const [auditMessage, setAuditMessage] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const [assetList, orderList] = await Promise.all([
        apiService.getAssets(),
        apiService.getOrders(),
      ]);
      setAssets(assetList);
      setOrders(orderList);
      const selected = assetList.find((a) => a.symbol === selectedSymbol);
      if (selected) {
        setLimitPrice(selected.current_price);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedSymbol]);

  const activeAsset = assets.find((a) => a.symbol === selectedSymbol) || assets[0];
  const activePrice = orderType === 'LIMIT' ? limitPrice : (activeAsset?.current_price || 150);
  const estimatedCost = quantity * activePrice;

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiService.submitOrder({
        symbol: selectedSymbol,
        side,
        order_type: orderType,
        quantity,
        price: activePrice,
      });
      await fetchData();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAuditOrder = async (orderId: number) => {
    setAuditingOrderId(orderId);
    setAuditMessage(null);
    try {
      const audit = await apiService.auditOrder(orderId);
      setAuditMessage(`AI Audit Completed! Confidence Score: ${audit.confidence_score}% - ${audit.explanation.slice(0, 70)}...`);
    } catch (e) {
      console.error(e);
    } finally {
      setAuditingOrderId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-quant-border pb-4">
        <h1 className="text-xl font-bold font-mono tracking-wide text-slate-100">TRADING ENGINE</h1>
        <p className="text-xs text-quant-textMuted font-mono">Market & Limit Order Execution, Depth Simulation & AI Audit Triggers</p>
      </div>

      {auditMessage && (
        <div className="bg-quant-cyan/10 border border-quant-cyan/30 p-4 rounded-xl flex items-center justify-between text-xs text-quant-cyan font-mono animate-in fade-in">
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5 shrink-0" />
            <span>{auditMessage}</span>
          </div>
          <button onClick={() => setAuditMessage(null)} className="text-slate-400 hover:text-slate-200">
            Dismiss
          </button>
        </div>
      )}

      {/* Ticker Selector Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {assets.map((asset) => {
          const isSelected = asset.symbol === selectedSymbol;
          const isUp = asset.change_24h >= 0;
          return (
            <button
              key={asset.symbol}
              onClick={() => setSelectedSymbol(asset.symbol)}
              className={`p-3.5 rounded-xl border text-left font-mono transition ${
                isSelected
                  ? 'bg-quant-card border-quant-cyan glow-cyan'
                  : 'bg-slate-900/60 border-quant-border hover:bg-slate-800/60'
              }`}
            >
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-bold text-slate-200">{asset.symbol}</span>
                <span className={`text-[10px] font-semibold ${isUp ? 'text-quant-green' : 'text-quant-red'}`}>
                  {isUp ? '+' : ''}{asset.change_24h}%
                </span>
              </div>
              <p className="text-sm font-bold text-slate-100">${asset.current_price.toLocaleString()}</p>
            </button>
          );
        })}
      </div>

      {/* Main Execution & Depth Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Form Column */}
        <div className="bg-quant-card border border-quant-border rounded-xl p-6 shadow-xl space-y-5">
          <div className="flex items-center justify-between border-b border-quant-border pb-3">
            <div>
              <h2 className="text-sm font-bold font-mono text-slate-100">{selectedSymbol} ORDER FORM</h2>
              <p className="text-xs text-quant-textMuted">Current: ${activeAsset?.current_price.toFixed(2)}</p>
            </div>
            <span className="px-2 py-0.5 text-[10px] font-mono bg-quant-cyan/10 text-quant-cyan border border-quant-cyan/20 rounded">
              PAPER EXECUTION
            </span>
          </div>

          <form onSubmit={handleOrderSubmit} className="space-y-4">
            {/* Side Toggle */}
            <div className="grid grid-cols-2 gap-2 bg-slate-900 p-1 rounded-lg border border-slate-800 font-mono">
              <button
                type="button"
                onClick={() => setSide('BUY')}
                className={`py-2 rounded text-xs font-bold transition flex items-center justify-center gap-1 ${
                  side === 'BUY' ? 'bg-quant-green text-slate-950 shadow-md' : 'text-slate-400'
                }`}
              >
                <ArrowUpRight className="w-3.5 h-3.5" /> BUY
              </button>
              <button
                type="button"
                onClick={() => setSide('SELL')}
                className={`py-2 rounded text-xs font-bold transition flex items-center justify-center gap-1 ${
                  side === 'SELL' ? 'bg-quant-red text-slate-950 shadow-md' : 'text-slate-400'
                }`}
              >
                <ArrowDownRight className="w-3.5 h-3.5" /> SELL
              </button>
            </div>

            {/* Type & Quantity */}
            <div className="grid grid-cols-2 gap-3 font-mono">
              <div>
                <label className="block text-xs text-slate-400 mb-1">TYPE</label>
                <select
                  value={orderType}
                  onChange={(e) => setOrderType(e.target.value as any)}
                  className="w-full bg-slate-900 border border-quant-border rounded-lg px-3 py-2 text-xs text-slate-100 focus:border-quant-cyan"
                >
                  <option value="MARKET">MARKET</option>
                  <option value="LIMIT">LIMIT</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">QUANTITY</label>
                <input
                  type="number"
                  step="any"
                  min="0.01"
                  value={quantity}
                  onChange={(e) => setQuantity(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-900 border border-quant-border rounded-lg px-3 py-2 text-xs text-slate-100 focus:border-quant-cyan"
                />
              </div>
            </div>

            {orderType === 'LIMIT' && (
              <div className="font-mono">
                <label className="block text-xs text-slate-400 mb-1">LIMIT PRICE ($)</label>
                <input
                  type="number"
                  step="any"
                  value={limitPrice}
                  onChange={(e) => setLimitPrice(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-900 border border-quant-border rounded-lg px-3 py-2 text-xs text-slate-100 focus:border-quant-cyan"
                />
              </div>
            )}

            {/* Pre-trade Cost Calculation */}
            <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800 text-xs font-mono space-y-1.5">
              <div className="flex justify-between text-slate-400">
                <span>Estimated Value:</span>
                <span className="text-slate-100 font-bold">${estimatedCost.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Estimated Slippage:</span>
                <span className="text-quant-green">0.02% (Optimal)</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-lg text-xs font-bold font-mono tracking-wider transition ${
                side === 'BUY'
                  ? 'bg-quant-green hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/20'
                  : 'bg-quant-red hover:bg-red-400 text-slate-950 shadow-lg shadow-red-500/20'
              }`}
            >
              {loading ? 'EXECUTING ORDER...' : `EXECUTE ${side} ${selectedSymbol}`}
            </button>
          </form>
        </div>

        {/* Order Book Depth Simulation */}
        <div className="lg:col-span-2 bg-quant-card border border-quant-border rounded-xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-quant-border pb-3 mb-4">
              <h2 className="text-sm font-bold font-mono text-slate-100">LEVEL 2 ORDER BOOK DEPTH ({selectedSymbol})</h2>
              <span className="text-xs text-quant-green font-mono">SPREAD: $0.05 (0.02%)</span>
            </div>

            {/* Ask / Bid Grid */}
            <div className="grid grid-cols-2 gap-4 text-xs font-mono">
              {/* Asks (Sell Orders - Red) */}
              <div>
                <p className="text-quant-red font-semibold mb-2 text-[11px] uppercase">Asks (Sell Depth)</p>
                <div className="space-y-1.5">
                  {[0.4, 0.3, 0.2, 0.1].map((offset, idx) => {
                    const price = activeAsset ? activeAsset.current_price + offset : 150 + offset;
                    const qty = Math.round(150 + idx * 80);
                    return (
                      <div key={idx} className="flex justify-between p-1.5 rounded bg-red-500/5 border border-red-500/10">
                        <span className="text-quant-red font-bold">${price.toFixed(2)}</span>
                        <span className="text-slate-400">{qty} shares</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Bids (Buy Orders - Green) */}
              <div>
                <p className="text-quant-green font-semibold mb-2 text-[11px] uppercase">Bids (Buy Depth)</p>
                <div className="space-y-1.5">
                  {[0.1, 0.2, 0.3, 0.4].map((offset, idx) => {
                    const price = activeAsset ? activeAsset.current_price - offset : 150 - offset;
                    const qty = Math.round(200 + idx * 60);
                    return (
                      <div key={idx} className="flex justify-between p-1.5 rounded bg-emerald-500/5 border border-emerald-500/10">
                        <span className="text-quant-green font-bold">${price.toFixed(2)}</span>
                        <span className="text-slate-400">{qty} shares</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 text-xs text-quant-textMuted font-mono mt-4">
            💡 <span className="text-slate-200 font-semibold">Institutional Slippage Protection:</span> QuantBot matches orders against synthetic liquidity pools ensuring optimal fill prices.
          </div>
        </div>
      </div>

      {/* Order History Table */}
      <div className="bg-quant-card border border-quant-border rounded-xl p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold font-mono text-slate-100">EXECUTED ORDER LOG</h2>
          <span className="text-xs text-quant-textMuted font-mono">{orders.length} Trades Executed</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="border-b border-quant-border text-quant-textMuted uppercase">
                <th className="pb-3 font-semibold">Order ID</th>
                <th className="pb-3 font-semibold">Asset</th>
                <th className="pb-3 font-semibold">Side</th>
                <th className="pb-3 font-semibold">Type</th>
                <th className="pb-3 font-semibold">Qty</th>
                <th className="pb-3 font-semibold">Executed Price</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold text-right">AI Auditor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-quant-border">
              {orders.map((ord) => (
                <tr key={ord.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3 text-slate-400">#{ord.id}</td>
                  <td className="py-3 font-bold text-slate-100">{ord.symbol}</td>
                  <td className="py-3 font-bold">
                    <span className={ord.side === 'BUY' ? 'text-quant-green' : 'text-quant-red'}>
                      {ord.side}
                    </span>
                  </td>
                  <td className="py-3 text-slate-300">{ord.order_type}</td>
                  <td className="py-3 text-slate-200">{ord.quantity}</td>
                  <td className="py-3 font-bold text-slate-100">${(ord.executed_price || ord.price).toFixed(2)}</td>
                  <td className="py-3">
                    <span className="inline-flex items-center gap-1 text-quant-green bg-quant-green/10 border border-quant-green/20 px-2 py-0.5 rounded text-[11px]">
                      <CheckCircle2 className="w-3 h-3" /> EXECUTED
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <button
                      onClick={() => handleAuditOrder(ord.id)}
                      disabled={auditingOrderId === ord.id}
                      className="inline-flex items-center gap-1 bg-quant-cyan/10 hover:bg-quant-cyan/20 text-quant-cyan border border-quant-cyan/30 px-3 py-1 rounded text-xs transition"
                    >
                      <Bot className="w-3.5 h-3.5" />
                      <span>{auditingOrderId === ord.id ? 'AUDITING...' : 'RUN AI AUDIT'}</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
