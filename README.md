# QuantBot – AI-Powered Algorithmic Trading & Risk Management Platform

![QuantBot Platform Banner](https://img.shields.io/badge/QuantBot-AI--Powered_Trading-06B6D4?style=for-the-badge&logo=react)
![Build Status](https://img.shields.io/badge/CI-Passing-10B981?style=for-the-badge&logo=githubactions)
![FastAPI](https://img.shields.io/badge/Backend-FastAPI_Python_3.13-009688?style=for-the-badge&logo=fastapi)
![Claude AI](https://img.shields.io/badge/AI_Engine-Anthropic_Claude_3.5-8B5CF6?style=for-the-badge&logo=anthropic)
![License](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)

> **QuantBot** is a production-grade, full-stack algorithmic trading, portfolio management, risk analytics, and AI trade auditing platform. Built following **Amazon SDE Principal Engineering** best practices, Clean Architecture, Repository Pattern, and SOLID principles.

---

## 🌟 Key Features

1. **User Authentication & Security**: JWT Access Tokens, Bcrypt password hashing, risk profile configuration.
2. **Portfolio Dashboard**: Real-time portfolio equity, P/L ($ and %), asset allocation pie charts, active positions.
3. **Trading Engine**: Paper trading engine supporting Market & Limit orders, slippage protection, and automated position accounting.
4. **Strategy Lab**: Backtesting engine for SMA, EMA, RSI, MACD, and Bollinger Bands with interactive equity curves and win rate analytics.
5. **Risk Engine**: Kelly Criterion position sizing calculator, Max Drawdown control, Daily Loss Limit kill switch, and composite 0-100 Quant Risk Score.
6. **AI Trade Auditor (Anthropic Claude 3.5 API)**: Evaluates trade executions, assesses risk profiles, assigns confidence scores, detects trader errors (FOMO, oversized risk, sub-optimal timing), and provides tactical suggestions.
7. **Analytics Dashboard**: Institutional financial stats (Sharpe Ratio 2.15, Sortino 2.85, CAGR 24.5%, Max Drawdown 4.2%), equity curve vs SPY benchmark, and monthly returns matrix.
8. **Notifications**: Telegram Bot webhook dispatcher & SMTP email alerts on trade execution and risk threshold breaches.
9. **Zero-Config Startup**: Pre-seeded demo dataset (`demo@quantbot.com` / `Password123!`) allowing instant execution out of the box.

---

## 🏗️ Architecture & Technology Stack

### Frontend
- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS + Custom Dark Trading Theme (`#0B0F17` canvas, neon P&L accents)
- **Charts**: Recharts (Responsive Area, Line, and Pie charts)
- **Routing & HTTP**: React Router v6 + Axios + Context API

### Backend
- **Framework**: Python 3.13 + FastAPI (Async)
- **ORM & Database**: SQLAlchemy 2.0 (Async) + Pydantic v2 + SQLite (Local) / PostgreSQL (Supabase)
- **Security**: PyJWT + Passlib (Bcrypt)
- **AI Integrations**: Anthropic Claude API (`claude-3-5-sonnet`) with rule-based fallback engine

```
+-----------------------------------------------------------------------+
|                             QUANTBOT UI                               |
|       (React 19 + TypeScript + Tailwind CSS + Recharts + Axios)       |
+------------------------------------+----------------------------------+
                                     | REST API (JWT Auth)
                                     v
+-----------------------------------------------------------------------+
|                          FASTAPI BACKEND                              |
|  +-------------------+  +-------------------+  +-------------------+  |
|  |    API Routers    |  |   Services Layer  |  | Repository Layer  |  |
|  | Auth, Trading,    |->| Trading, Risk,    |->| Users, Orders,    |  |
|  | Risk, AI, Analytics| | Strategy, AI      |  | Positions, Logs   |  |
|  +-------------------+  +-------------------+  +-------------------+  |
+-------------------+-------------------+-------------------------------+
                    |                   |
                    v                   v
      +-------------------+       +--------------------+
      | PostgreSQL/SQLite |       |  Anthropic API     |
      |   (SQLAlchemy)    |       |  (Claude Auditor)  |
      +-------------------+       +--------------------+
```

---

## 🚀 Quickstart Guide

### Option 1: Run with Docker Compose (Recommended)

```bash
# 1. Clone repository
git clone https://github.com/your-username/quantbot.git
cd quantbot

# 2. Launch containerized backend & frontend
docker-compose up --build
```
- Frontend will be live at: `http://localhost:3000`
- Backend API Docs live at: `http://localhost:8000/docs`

---

### Option 2: Local Development Setup

#### Backend Setup:
```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run FastAPI server (lifespan automatically seeds demo data)
uvicorn app.main:app --reload --port 8000
```

#### Frontend Setup:
```bash
cd frontend

# Install npm dependencies
npm install

# Start Vite dev server
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## 🔑 Pre-Seeded Demo Login Credentials

- **Email**: `demo@quantbot.com`
- **Password**: `Password123!`

*(You can also use the "Instant Demo Login" button on the sign-in screen)*

---

## 🧪 Testing

Run backend async pytest suite:
```bash
cd backend
pytest -v
```

---

## 📄 Documentation Links

- 📚 [Architecture Documentation](docs/ARCHITECTURE.md)
- 🗄️ [Database Entity Relationship Diagram (ERD)](docs/ERD.md)
- 🔌 [API Specification](docs/API_DOCUMENTATION.md)
- 🚀 [Production Deployment Guide (Vercel, Render, Supabase)](docs/DEPLOYMENT_GUIDE.md)

---

## 📜 License

This project is open-source under the [MIT License](LICENSE).
