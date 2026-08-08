import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, ShieldCheck, TrendingUp, Bot } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LoginPage: React.FC = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isRegister) {
        await register({ email, password, full_name: fullName });
      } else {
        await login({ email, password });
      }
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Authentication failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setLoading(true);
    try {
      await login({ email: 'demo@quantbot.com', password: 'Password123!' });
      navigate('/');
    } catch (e) {
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-quant-bg flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decorative Glow Gradients */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-quant-card border border-quant-border rounded-2xl p-8 shadow-2xl relative z-10">
        {/* Header Branding */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-quant-cyan to-blue-600 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-cyan-500/30">
            <Zap className="w-7 h-7 text-slate-950 font-bold" />
          </div>
          <h1 className="text-2xl font-bold text-slate-100 tracking-wider font-mono">
            QUANT<span className="text-quant-cyan">BOT</span>
          </h1>
          <p className="text-xs text-quant-textMuted mt-1">AI-Powered Trading & Risk Management Platform</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 p-3 rounded-lg text-xs text-red-400 mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 font-mono">FULL NAME</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Alex Mercer"
                className="w-full bg-slate-900 border border-quant-border rounded-lg px-3.5 py-2.5 text-sm text-slate-100 font-mono focus:outline-none focus:border-quant-cyan"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 font-mono">EMAIL ADDRESS</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="trader@quantbot.com"
              className="w-full bg-slate-900 border border-quant-border rounded-lg px-3.5 py-2.5 text-sm text-slate-100 font-mono focus:outline-none focus:border-quant-cyan"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 font-mono">PASSWORD</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-slate-900 border border-quant-border rounded-lg px-3.5 py-2.5 text-sm text-slate-100 font-mono focus:outline-none focus:border-quant-cyan"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-quant-cyan to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold py-3 rounded-lg text-xs tracking-wider font-mono shadow-lg shadow-cyan-500/20 transition transform hover:-translate-y-0.5 mt-2"
          >
            {loading ? 'PROCESSING...' : isRegister ? 'CREATE QUANT ACCOUNT' : 'SIGN IN TO PLATFORM'}
          </button>
        </form>

        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-quant-border"></div>
          </div>
          <span className="relative bg-quant-card px-3 text-[11px] font-mono text-quant-textMuted uppercase">OR DEMO ACCESS</span>
        </div>

        <button
          onClick={handleDemoLogin}
          disabled={loading}
          className="w-full bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-semibold py-2.5 rounded-lg text-xs font-mono transition flex items-center justify-center gap-2"
        >
          <Bot className="w-4 h-4 text-quant-cyan" />
          <span>INSTANT DEMO LOGIN (Alex Mercer)</span>
        </button>

        <p className="text-center text-xs text-quant-textMuted mt-6">
          {isRegister ? 'Already have an account?' : "Don't have a QuantBot account?"}{' '}
          <button
            onClick={() => setIsRegister(!isRegister)}
            className="text-quant-cyan hover:underline font-semibold font-mono ml-1"
          >
            {isRegister ? 'Sign In' : 'Register Now'}
          </button>
        </p>
      </div>
    </div>
  );
};
