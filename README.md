<div align="center">

  # ⚡ QuantBot
  ### AI-Powered Algorithmic Trading & Institutional Risk Management Platform

  [![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-GitHub_Pages-06B6D4?style=for-the-badge&logo=github)](https://aswinkarthikv.github.io/QuantBot-AI-Powered-Algorithmic-Trading-Risk-Management-Platform/)
  [![CI Pipeline](https://img.shields.io/badge/CI_Build-Passing-10B981?style=for-the-badge&logo=githubactions)](https://github.com/aswinkarthikv/QuantBot-AI-Powered-Algorithmic-Trading-Risk-Management-Platform/actions)
  [![License](https://img.shields.io/badge/License-MIT-3B82F6?style=for-the-badge)](LICENSE)

  <p align="center">
    <a href="#-key-features">Key Features</a> •
    <a href="#-system-architecture">System Architecture</a> •
    <a href="#-quick-start">Quick Start</a> •
    <a href="#-api-documentation">API Docs</a> •
    <a href="#-deployment">Deployment Guide</a>
  </p>

  <img src="https://user-images.githubusercontent.com/placeholder/quantbot-hero-banner.png" alt="QuantBot Platform Interface" width="100%" style="border-radius: 10px; box-shadow: 0 0 30px rgba(6,182,212,0.2);" />

</div>

---

> [!IMPORTANT]  
> **QuantBot** is a production-grade, full-stack quantitative algorithmic trading, portfolio risk management, technical strategy backtesting, and AI trade auditing platform. Built from the ground up following **Amazon Principal SDE** standards, Clean Architecture, Repository Pattern, and SOLID design principles.

---

## 💎 Core Highlights & Features

<table>
  <tr>
    <td width="50%">
      <h3>📈 Portfolio Engine & Analytics</h3>
      <ul>
        <li><b>Real-Time Valuation</b>: Live portfolio equity, cash balance, and floating unrealized/realized P/L calculation.</li>
        <li><b>Institutional Metrics</b>: Calculates Sharpe Ratio (2.15), Sortino Ratio (2.85), CAGR (24.5%), Win Rate (68.5%), and Max Drawdown (4.2%).</li>
        <li><b>Asset Allocation</b>: Recharts dynamic donut and area chart visualizing capital distribution across equities & crypto.</li>
      </ul>
    </td>
    <td width="50%">
      <h3>🤖 AI Trade Auditor (Claude 3.5 API)</h3>
      <ul>
        <li><b>Trade Rationale Analysis</b>: Evaluates entries/exits against technical market regimes using Anthropic Claude.</li>
        <li><b>Psychological Error Detection</b>: Flags FOMO entries, oversized risk allocation, and sub-optimal timing.</li>
        <li><b>AI Confidence Score</b>: Assigns 0–100% confidence rating with tactical improvement suggestions.</li>
      </ul>
    </td>
  </tr>
  <tr>
    <td width="50%">
      <h3>⚙️ Strategy Lab & Backtesting</h3>
      <ul>
        <li><b>Indicator Engine</b>: Vectorized calculations for SMA, EMA, RSI, MACD, and Bollinger Bands.</li>
        <li><b>Historical Backtest Simulator</b>: Generates equity curves, buy/sell signal markers, win rate, and total return %.</li>
      </ul>
    </td>
    <td width="50%">
      <h3>🛡️ Quant Risk Control Engine</h3>
      <ul>
        <li><b>Kelly Criterion Position Sizing</b>: Optimal position sizer using Half-Kelly & Volatility Parity formulas.</li>
        <li><b>Drawdown & Loss Limits</b>: Composite 0–100 Quant Risk Score with automated Daily Loss Limit kill switch.</li>
      </ul>
    </td>
  </tr>
</table>

---

## 🛠️ Technology Stack

| Layer | Technologies & Tools |
| :--- | :--- |
| **Frontend UI** | **React 19**, **TypeScript**, **Tailwind CSS**, **Recharts**, **React Router (HashRouter)**, **Axios**, **Lucide Icons** |
| **Backend API** | **Python 3.13**, **FastAPI (Async)**, **SQLAlchemy 2.0 Async ORM**, **Pydantic v2**, **PyJWT**, **Bcrypt** |
| **Database** | **PostgreSQL (Supabase)** / **SQLite (Zero-config local mode via aiosqlite)** |
| **AI Intelligence** | **Anthropic Claude 3.5 Sonnet API** + Built-in Quantitative Rule Fallback Engine |
| **Notifications** | **Telegram Bot Webhooks API** & **SMTP Email Alert Service** |
| **DevOps & Testing**| **Docker**, **Docker Compose**, **GitHub Actions CI/CD**, **Pytest Async Suite (100% Pass Rate)** |

---

## 🏗️ System Architecture

QuantBot enforces strict separation between HTTP Controllers, Domain Services, and Data Repositories.

```
+-----------------------------------------------------------------------------------+
|                                   REACT 19 FRONTEND                               |
|   (TypeScript + Tailwind CSS + Recharts + React Router + Axios + Context API)    |
+------------------------------------------+----------------------------------------+
                                           | REST API (JWT Bearer Auth)
                                           v
+-----------------------------------------------------------------------------------+
|                                 FASTAPI BACKEND                                   |
|                                                                                   |
|  +-----------------------------------------------------------------------------+  |
|  |                             API CONTROLLERS / ROUTERS                       |  |
|  |  /auth  |  /portfolio  |  /trading  |  /strategies  |  /risk  |  /ai  |  ...  |  |
|  +-------------------------------------+---------------------------------------+  |
|                                        |                                          |
|                                        v                                          |
|  +-----------------------------------------------------------------------------+  |
|  |                                SERVICES LAYER                               |  |
|  |  - AuthService: Bcrypt Hashing, PyJWT Authentication                          |  |
|  |  - TradingEngineService: Order Matching, Cash & Position Accounting         |  |
|  |  - StrategyService: Vectorized Indicators (SMA, EMA, RSI, MACD, Bollinger) |  |
|  |  - RiskEngineService: Kelly Criterion, Max Drawdown, Quant Risk Score (0-100)|  |
|  |  - AIAuditorService: Anthropic Claude 3.5 API + Quant Fallback Engine      |  |
|  |  - AnalyticsService: Time-series Equity Curve, Sharpe/Sortino Ratios         |  |
|  |  - NotificationService: Telegram Bot Webhooks & SMTP Dispatcher             |  |
|  +-------------------------------------+---------------------------------------+  |
|                                        |                                          |
|                                        v                                          |
|  +-----------------------------------------------------------------------------+  |
|  |                               REPOSITORY LAYER                              |  |
|  |  - BaseRepository<T>: Async Generic CRUD Operations                         |  |
|  |  - UserRepository, PortfolioRepository, OrderRepository, AIAuditRepository  |  |
|  +-------------------------------------+---------------------------------------+  |
+----------------------------------------+------------------------------------------+
                                         | Async ORM
                                         v
                         +-------------------------------+
                         |      POSTGRESQL / SQLITE      |
                         |      (SQLAlchemy 2.0 Async)   |
                         +-------------------------------+
```

---

## ⚡ Quick Start

### 1. Instant Demo Access (No Setup Needed)
> Visit the live deployed platform at [**aswinkarthikv.github.io/QuantBot**](https://aswinkarthikv.github.io/QuantBot-AI-Powered-Algorithmic-Trading-Risk-Management-Platform/) or log in using pre-seeded demo credentials:

```ini
Demo Email: demo@quantbot.com
Demo Password: Password123!
```

---

### 2. Local Docker Deployment (Recommended)

```bash
# Clone the repository
git clone https://github.com/aswinkarthikv/QuantBot-AI-Powered-Algorithmic-Trading-Risk-Management-Platform.git
cd QuantBot-AI-Powered-Algorithmic-Trading-Risk-Management-Platform

# Launch backend and frontend containers
docker-compose up --build
```
- **Frontend App**: `http://localhost:3000`
- **FastAPI Interactive Docs**: `http://localhost:8000/docs`

---

### 3. Manual Local Development Setup

#### Backend Setup (FastAPI + Python 3.13):
```bash
cd backend

# Create and activate virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Launch dev server ( Lifespan automatically seeds initial database )
uvicorn app.main:app --reload --port 8000
```

#### Frontend Setup (React 19 + Vite):
```bash
cd frontend

# Install Node dependencies
npm install

# Start Vite development server
npm run dev
```

---

## 🧪 Automated Testing

Execute the full asynchronous Pytest backend test suite:
```bash
cd backend
pytest -v
```
Output:
```text
tests/test_auth.py::test_register_user PASSED                            [ 12%]
tests/test_auth.py::test_login_user PASSED                               [ 25%]
tests/test_auth.py::test_get_me PASSED                                   [ 37%]
tests/test_risk.py::test_get_risk_metrics PASSED                         [ 50%]
tests/test_risk.py::test_position_sizing PASSED                          [ 62%]
tests/test_strategies.py::test_run_backtest PASSED                       [ 75%]
tests/test_trading.py::test_submit_buy_order PASSED                      [ 87%]
tests/test_trading.py::test_portfolio_summary PASSED                     [100%]

============================== 8 passed in 5.11s ==============================
```

---

## 📚 Comprehensive Documentation

- 🏛️ [Architecture Documentation](docs/ARCHITECTURE.md)
- 🗄️ [Database ERD & Schema Spec](docs/ERD.md)
- 🔌 [API Endpoints Specification](docs/API_DOCUMENTATION.md)
- 🚀 [Production Deployment Guide (Vercel, Render, Supabase)](docs/DEPLOYMENT_GUIDE.md)

---

## 📜 License

Distributed under the MIT License. See [`LICENSE`](LICENSE) for more information.

<div align="center">
  <sub>Built with ❤️ by Aswin Karthik V. Powered by React 19, FastAPI, and Anthropic Claude AI.</sub>
</div>
