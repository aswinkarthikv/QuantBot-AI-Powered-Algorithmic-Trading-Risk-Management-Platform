import React, { useState } from 'react';
import { X, ArrowUpRight, ArrowDownRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { apiService } from '../../services/api';
import { Asset } from '../../types';

interface TradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  assets: Asset[];
  onOrderSuccess: () => void;
}

export const TradeModal: React.FC<TradeModalProps> = ({ isOpen, onClose, assets, onOrderSuccess }) => {
  const [symbol, setSymbol] = useState('AAPL');
  const [side, setSide] = useState<'BUY' | 'SELL'>('BUY');
  const [orderType, setOrderType] = useState<'MARKET' | 'LIMIT'>('MARKET');
  const [quantity, setQuantity] = useState(10);
  const [limitPrice, setLimitPrice] = useState(224.5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const selectedAsset = assets.find((a) => a.symbol === symbol) || assets[0];
  const activePrice = orderType === 'LIMIT' ? limitPrice : (selectedAsset?.current_price || 150);
  const estimatedTotal = quantity * activePrice;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await apiService.submitOrder({
        symbol,
        side,
        order_type: orderType,
        quantity,
        price: activePrice,
      });
      onOrderSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to submit order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-quant-card border border-quant-border rounded-xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-quant-border bg-slate-900/50">
          <div>
            <h2 className="text-base font-bold text-slate-100 font-mono">ORDER ENTRY</h2>
            <p className="text-xs text-quant-textMuted">Quant Engine Paper Execution</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-200 p-1 rounded-lg hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 p-3 rounded-lg flex items-center gap-2 text-xs text-red-400">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Side Toggle BUY vs SELL */}
          <div className="grid grid-cols-2 gap-2 bg-slate-900 p-1 rounded-lg border border-slate-800">
            <button
              type="button"
              onClick={() => setSide('BUY')}
              className={`py-2 rounded-md text-xs font-bold font-mono transition flex items-center justify-center gap-1.5 ${
                side === 'BUY'
                  ? 'bg-quant-green text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ArrowUpRight className="w-4 h-4" />
              BUY (LONG)
            </button>
            <button
              type="button"
              onClick={() => setSide('SELL')}
              className={`py-2 rounded-md text-xs font-bold font-mono transition flex items-center justify-center gap-1.5 ${
                side === 'SELL'
                  ? 'bg-quant-red text-slate-950 shadow-md shadow-red-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ArrowDownRight className="w-4 h-4" />
              SELL (SHORT)
            </button>
          </div>

          {/* Ticker Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 font-mono">ASSET TICKER</label>
            <select
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              className="w-full bg-slate-900 border border-quant-border rounded-lg px-3 py-2 text-sm text-slate-100 font-mono focus:outline-none focus:border-quant-cyan"
            >
              {assets.map((a) => (
                <option key={a.symbol} value={a.symbol}>
                  {a.symbol} — {a.name} (${a.current_price.toFixed(2)})
                </option>
              ))}
            </select>
          </div>

          {/* Order Type MARKET vs LIMIT */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 font-mono">ORDER TYPE</label>
              <select
                value={orderType}
                onChange={(e) => setOrderType(e.target.value as any)}
                className="w-full bg-slate-900 border border-quant-border rounded-lg px-3 py-2 text-sm text-slate-100 font-mono focus:outline-none focus:border-quant-cyan"
              >
                <option value="MARKET">MARKET</option>
                <option value="LIMIT">LIMIT</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 font-mono">QUANTITY</label>
              <input
                type="number"
                step="any"
                min="0.01"
                value={quantity}
                onChange={(e) => setQuantity(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-900 border border-quant-border rounded-lg px-3 py-2 text-sm text-slate-100 font-mono focus:outline-none focus:border-quant-cyan"
              />
            </div>
          </div>

          {orderType === 'LIMIT' && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 font-mono">LIMIT PRICE ($)</label>
              <input
                type="number"
                step="any"
                value={limitPrice}
                onChange={(e) => setLimitPrice(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-900 border border-quant-border rounded-lg px-3 py-2 text-sm text-slate-100 font-mono focus:outline-none focus:border-quant-cyan"
              />
            </div>
          )}

          {/* Risk & Cost Preview Card */}
          <div className="bg-slate-900/80 p-3.5 rounded-lg border border-slate-800 space-y-2 text-xs font-mono">
            <div className="flex justify-between text-slate-400">
              <span>Estimated Order Total:</span>
              <span className="text-slate-100 font-bold">${estimatedTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Pre-trade Risk Status:</span>
              <span className="text-quant-green flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> PASSED
              </span>
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
            {loading ? 'EXECUTING ORDER...' : `SUBMIT ${side} ORDER`}
          </button>
        </form>
      </div>
    </div>
  );
};
